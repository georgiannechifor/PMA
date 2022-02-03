/* eslint-disable max-len */
module.exports = {
  reactStrictMode : true,

  env : {
    ORIGIN_URL : process.env.ORIGIN_URL
  },

  redirects () {
    return [
      {
        source      : '/admin-config',
        destination : '/admin-config/users',
        permanent   : true
      }
    ];
  }
};
