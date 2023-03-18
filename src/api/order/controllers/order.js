const stripe = require('stripe')('sk_test_51IlaJaSE2LpFM67yrMb45HitDsgj5smItff791KMMDV6NxrvnecIMPL0xkA91f9WovuXDquTxV8IbaExVKGeDXi000s7lGf7NI')

'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi})=>({
    async create(ctx) {
        const {products} = ctx.request.body;
        try {
        const lineItems = await Promise.all(
            products.map(async (product)=> {
               const item = await  strapi.service("api::product.product").findOne(product.id)

               return {
                price_data: {
                    currency:"usd",
                    product_data:{
                        name:item.title
                    },
                    unit_amount:Math.round(item.price * 100)
                },
                quantity:product.count
               }
            })
        );

        console.log(products)
       
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                success_url: process.env.CLIENT_URL+"?success=true",
                cancel_url: process.env.CLIENT_URL+"?success=false",
                line_items:lineItems,
                shipping_address_collection: {allowed_countries: ["US","CA","IN"]},
                payment_method_types:["card"],
            })
            await strapi.service("api::order.order").create({data:{
                products,
                stripeid:session.id
            }})
            return {stripeSession : session}
        } catch(err) {
            ctx.response.status = 500;
            return err;
        }
    }
}));
