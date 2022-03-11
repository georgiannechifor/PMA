import {dbConnect} from 'utils/dbConnect';
import Deployment from 'models/deployment';
import User from 'models/user';
import Project from 'models/project';
import {authenticated} from 'service/index';

import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_OK
} from 'constants/index';

dbConnect();

const deploymentsHandler = authenticated(async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'GET': {
      try {
        const deployments = await Deployment.find({});

        return res.status(STATUS_OK).json({
          data : deployments
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          error : {
            message : error.message
          }
        });
      }
    }
    case 'POST': {
      try {
        const user = await User.findById(req.userIDFromToken);
        const deployment = await Deployment.create({
          ...req.body,
          author: user._id, // eslint-disable-line
        });

        return res.status(STATUS_CREATED).json({
          data : deployment
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          error : {
            message : error.message
          }
        });
      }
    }
    default: {
      return res.status(STATUS_METHOD_NOT_ALLOWED).json({
        error : {
          message : 'Method not allowed'
        }
      });
    }
  }
});

export default deploymentsHandler;
