/* eslint-disable max-len */
module.exports = {
  reactStrictMode : true,

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
