import {dbConnect} from 'utils/dbConnect';
import User from 'models/user';
import {
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_CREATED
} from 'constants/responseStatus';

dbConnect();

const usersHandler = async (req, res) => {
  const { method } = req;
  switch(method) {
    case 'GET': {
      try {
        const users = await User.find({}).select(['-__v', '-password']).exec();
        return res.status(STATUS_OK).json({
          data: users
        })
      } catch(error) {
        return res.status(STATUS_NOT_FOUND).json({
          error : error
        })
      }
    }
    default: {
      return res.status(STATUS_METHOD_NOT_ALLOWED).json({
        error: 'Method not allowed'
      })
    }
  }
};

export default usersHandler;
