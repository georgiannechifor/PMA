import {dbConnect} from 'utils/dbConnect';
import Event from 'models/event';
import {authenticated} from 'service/index';

import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

const eventsHandler = authenticated(async (req, res) => { // eslint-disable-line complexity, max-statements
  const {query : {id}, method} = req;

  switch (method) {
    case 'GET': {
      try {
        const event = await Event.findById(id);

        if (event) {
          res.status(STATUS_OK).json({
            data : event
          });
        } else {
          res.status(STATUS_NOT_FOUND).json({
            message : 'Event not found'
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
        const event = await Event
          .findByIdAndUpdate(id, req.body, {
            new : true
          });

        if (!event) {
          res.status(STATUS_NOT_FOUND).json({
            message : 'Event not found'
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : event
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
        const deletedEvent = await Event.deleteOne({_id : id});

        if (!deletedEvent) {
          res.status(STATUS_NOT_FOUND).json({
            message : 'Team not deleted'
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : deletedEvent
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
