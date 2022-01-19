import { dbConnect } from 'utils/dbConnect';
import User from 'models/user';
import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

export default async (req, res) => {
  const { query : { id }, method } = req;

  switch(method) {
    case 'GET': {
      try {
        const user = await User.findById(id).select(['-__v', '-password']);

        if(user) {
            return res.status(STATUS_OK).json({
              data : user
            })
        }
        return res.status(STATUS_NOT_FOUND).json({
          message : 'User not found'
        })
      } catch(error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        })
      }
    }
    case 'PUT': {
      try {
        const user = await User
          .findByIdAndUpdate(id, req.body, {
            new : true,
            runValidators: true
          })
          .select(['-__v', '-password']);

        if(!user) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'User not found'
          })
        }

        return res.status(STATUS_OK).json({
          data : user
        })
      } catch(error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        })
      }
    }
    case 'DELETE': {
      try {
        const deletedUser = await User.deleteOne({ _id: id });

        if(!deletedNode) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'User not deleted'
          })
        }
        return res.status(STATUS_OK).json({
          data : {}
        })
      } catch (e) {

      } finally {

      }
    }
    default: {
      return res.status(STATUS_BAD_REQUEST).json({
        message: 'Method not allowed'
      })
    }
  }
}
