import {dbConnect} from 'utils/dbConnect';
import Deployment from 'models/deployment';
import {authenticated} from 'service/index';

import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

// eslint-disable-next-line complexity, max-statements
const deploymentHandler = authenticated(async (req, res) => {
  const {query : {id}, method} = req;

  switch (method) {
    case 'GET': {
      try {
        const deployment = await Deployment.findById(id);

        if (deployment) {
          res.status(STATUS_OK).json({
            data : deployment
          });
        } else {
          res.status(STATUS_NOT_FOUND).json({
            error : {
              message : 'Deployment not found'
            }
          });
        }
        break;
      } catch (error) {
        res.status(STATUS_BAD_REQUEST).json({
          error : {
            message : error.message
          }
        });
        break;
      }
    }
    case 'PUT': {
      try {
        const deployment = await Deployment
          .findByIdAndUpdate(id, req.body, {
            new : true
          });

        if (!deployment) {
          res.status(STATUS_NOT_FOUND).json({
            error : {
              message : 'Deployment not found'
            }
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : deployment
        });
        break;
      } catch (error) {
        res.status(STATUS_BAD_REQUEST).json({
          error : {
            message : error.message
          }
        });
        break;
      }
    }
    case 'DELETE': {
      try {
        const deletedDeployment = await Deployment.deleteOne({_id : id});

        if (!deletedDeployment) {
          res.status(STATUS_NOT_FOUND).json({
            error : {
              message : 'Deployment not deleted'
            }
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : deletedDeployment
        });
        break;
      } catch (error) {
        res.status(STATUS_OK).json({
          error : {
            message : error.message
          }
        });
        break;
      }
    }
    default: {
      res.status(STATUS_BAD_REQUEST).json({
        error : {
          message : 'Method not allowed'
        }
      });
      break;
    }
  }
});

export default deploymentHandler;
