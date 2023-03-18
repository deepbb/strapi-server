module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('h1kkOc49rN/IBxStP0L57g==,VaxT1I+zZrLC+eq0E7Q4Yw==,L4HEQfhKVoDhTGH/SggXXw==,oFunSnkjNhWGRBx248OrFw=='),
  },
});
