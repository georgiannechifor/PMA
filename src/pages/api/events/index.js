import {dbConnect} from 'utils/dbConnect';
import Event from 'models/event';
import {authenticated} from 'service/index';
import groupBy from 'lodash/groupBy';

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
        const events = await Event.find({})
          .populate('author', 'firstName lastName email')
          .populate('assignee', 'firstName lastName email')
          .exec();
        const groupedEvents = groupBy(events, event => event.date);


        return res.status(STATUS_OK).json({
          data : groupedEvents
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'POST': {
      try {
        const event = await Event.create({
          ...req.body,
          author : req.userIDFromToken
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
