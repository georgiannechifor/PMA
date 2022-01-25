import cookie from 'cookie';
import {STATUS_METHOD_NOT_ALLOWED} from 'constants/responseStatus';

import {COOKIE_OPTIONS} from 'constants/cookie';

const logoutHandler = (req, res) => {
  const {method} = req;

  switch (method) {
    case 'POST': {
      res.setHeader('Set-Cookie', cookie.serialize('authToken', 'removed', COOKIE_OPTIONS));

      return res.status(200).json({
        message : 'User logged out successfully'
      });
    }
    default : {
      return res.status(STATUS_METHOD_NOT_ALLOWED).json({
        error : 'Method not allowed'
      });
    }
  }
};

export default logoutHandler;
