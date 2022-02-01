import {dbConnect} from 'utils/dbConnect';
import Team from 'models/team';
import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

export default async (req, res) => { // eslint-disable-line complexity, max-statements
  const {query : {id}, method} = req;

  switch (method) {
    case 'PUT': {
      try {
        const team = await Team
          .findByIdAndUpdate(id, req.body, {
            new           : true,
            runValidators : true
          });

        if (!team) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'Team not found'
          });
        }

        return res.status(STATUS_OK).json({
          data : team
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'DELETE': {
      try {
        const deletedUser = await Team.deleteOne({_id : id});

        if (!deletedUser) {
          return res.status(STATUS_NOT_FOUND).json({
            message : 'Team not deleted'
          });
        }

        return res.status(STATUS_OK).json({
          data : {}
        });
      } catch (error) {
        return res.status(STATUS_OK).json({
          message : error.message
        });
      }
    }
    default: {
      return res.status(STATUS_BAD_REQUEST).json({
        message : 'Method not allowed'
      });
    }
  }
};
