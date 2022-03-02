import {dbConnect} from 'utils/dbConnect';
import Event from 'models/event';
import User from 'models/user';
import {authenticated} from 'service/index';

import {
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_BAD_REQUEST,
  STATUS_OK,
  STATUS_CREATED
} from 'constants/responseStatus';
import {USER_ROLES} from 'constants/userRoles';

dbConnect();

// eslint-disable-next-line complexity
const eventsHandler = authenticated(async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'GET': {
      try {
        const user = await User.findById(req.userIDFromToken);

        let query = {};

        /* If user is super admin, then deliver all events saved on platform */
        if (user.jobTitle === USER_ROLES.SUPER_ADMIN) {
          query = {};

        /* If user is an admin, then deliver all events assigned to its team, a member of its team or to current user */
        } else if (user.jobTitle === USER_ROLES.ADMIN) {
          query = {$or : [{
            assignee : {
              team : user.team
            }
          }, {
            author : user._id // eslint-disable-line no-underscore-dangle
          }, {
            teamAssigned : user.team
          }
          ]};
        } else {
        /* In case of an user, deliver events assigned to user's team or to user */
          query = {$or : [{
            assignee : user._id // eslint-disable-line no-underscore-dangle
          }, {
            teamAssigned : user.team
          }
          ]};
        }

        const events = await Event.find(query)
          .populate('author', 'firstName lastName email')
          .populate('assignee', 'firstName lastName email')
          .populate('teamAssigned', 'name')
          .exec();


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
