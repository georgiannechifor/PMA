import {dbConnect} from 'utils/dbConnect';
import Project from 'models/project';
import {authenticated} from 'service/index';

import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_OK
} from 'constants/index';

dbConnect();

const projectsHandler = authenticated(async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'GET': {
      try {
        const projects = await Project.find({}).populate('team');

        return res.status(STATUS_OK).json({
          data : projects
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'POST': {
      try {
        const project = await Project.create({
          ...req.body
        });

        return res.status(STATUS_CREATED).json({
          data : project
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          error : error.message
        });
      }
    }
    default: {
      return res.status(STATUS_METHOD_NOT_ALLOWED).json({
        error : 'Method not allowed'
      });
    }
  }
});

export default projectsHandler;
