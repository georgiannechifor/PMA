export const COOKIE_OPTIONS = {
  httpOnly  : true,
  secure    : process.env.NODE_ENV !== 'development',
  sameSimte : 'strict',
  maxAge    : 604800,
  path      : '/'
};
