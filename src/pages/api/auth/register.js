import cookie from 'cookie';
import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';

import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_METHOD_NOT_ALLOWED
} from 'constants/responseStatus';
import {COOKIE_OPTIONS} from 'constants/cookie';

dbConnect();

const registerHandler = async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'POST': {
      try {
        req.body.jobTitle = undefined;
        const user = await User.create(req.body);
        const token = user.getJwtToken();

        user.password = undefined;
        res.setHeader('Set-Cookie', cookie.serialize('authToken', token, COOKIE_OPTIONS));

        return res.status(STATUS_CREATED).json({
          data : user
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          error : error.message
        });
      }
    }
    default : {
      return res.status(STATUS_METHOD_NOT_ALLOWED).json({
        error : 'Method not allowed'
      });
    }
  }
};

export default registerHandler;
