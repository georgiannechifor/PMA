import {dbConnect} from 'utils/dbConnect';
import Team from 'models/team';
import {authenticated} from 'service/index';

import {
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_BAD_REQUEST,
  STATUS_OK,
  STATUS_CREATED
} from 'constants/responseStatus';

dbConnect();

const eventsHandler = authenticated(async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'GET': {
      try {
        const events = await Team.find({}).populate('admin', 'firstName lastName');


        return res.status(STATUS_OK).json({
          data : events
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'POST': {
      try {
        const event = await Team.create({
          ...req.body
        });

        return res.status(STATUS_CREATED).json({
          data : event
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

export default eventsHandler;
