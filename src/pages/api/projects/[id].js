import {dbConnect} from 'utils/dbConnect';
import Project from 'models/project';
import {authenticated} from 'service/index';

import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

// eslint-disable-next-line complexity, max-statements
const eventsHandler = authenticated(async (req, res) => {
  const {query : {id}, method} = req;

  switch (method) {
    case 'GET': {
      try {
        const project = await Project.findById(id);

        if (project) {
          res.status(STATUS_OK).json({
            data : project
          });
        } else {
          res.status(STATUS_NOT_FOUND).json({
            message : 'Project not found'
          });
        }
        break;
      } catch (error) {
        res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
        break;
      }
    }
    case 'PUT': {
      try {
        const project = await Project
          .findByIdAndUpdate(id, req.body, {
            new : true
          });

        if (!project) {
          res.status(STATUS_NOT_FOUND).json({
            message : 'Project not found'
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : project
        });
        break;
      } catch (error) {
        res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
        break;
      }
    }
    case 'DELETE': {
      try {
        const deletedProject = await Project.deleteOne({_id : id});

        if (!deletedProject) {
          res.status(STATUS_NOT_FOUND).json({
            message : 'Project not deleted'
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : deletedProject
        });
        break;
      } catch (error) {
        res.status(STATUS_OK).json({
          message : error.message
        });
        break;
      }
    }
    default: {
      res.status(STATUS_BAD_REQUEST).json({
        message : 'Method not allowed'
      });
      break;
    }
  }
});

export default eventsHandler;
