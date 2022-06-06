module.exports = {
  reactStrictMode : true,
  images          : {
    loader : 'akamai',
    path   : ''
  },
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
