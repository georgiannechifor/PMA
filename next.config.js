/* eslint-disable max-len */
module.exports = {
  reactStrictMode : true,
  env             : {
    MONGO_URI  : 'mongodb+srv://root:3ebpgwe9a5ySmDKL@pma.3ehv6.mongodb.net/pma_db?retryWrites=true&w=majority',
    JWT_SECRET : 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY0MjU4ODY0MiwiaWF0IjoxNjQyNTg4NjQyfQ.PzSA67SU7GjXny2w3uls-xpqrPtt0NSkadHsPgOddus',

    // Expires 7 days
    JWT_EXPIRES_TIME : '604800'
  }
};
