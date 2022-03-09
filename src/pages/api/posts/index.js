import moment from 'moment';
import {dbConnect} from 'utils/dbConnect';
import Post from 'models/post';
import User from 'models/user';
import {authenticated} from 'service/index';

import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_OK
} from 'constants/index';

dbConnect();

const postsHandler = authenticated(async (req, res) => {
  const {method} = req;

  switch (method) {
    case 'GET': {
      try {
        const posts = await Post.find({}).populate('author', 'firstName lastName');

        return res.status(STATUS_OK).json({
          data : posts
        });
      } catch (error) {
        return res.status(STATUS_BAD_REQUEST).json({
          message : error.message
        });
      }
    }
    case 'POST': {
      try {
        const user = await User.findById(req.userIDFromToken);
        const post = await Post.create({
          ...req.body,
          author: user._id, // eslint-disable-line
          date   : moment().format('DD/MM/YYYY')
        });

        return res.status(STATUS_CREATED).json({
          data : post
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

export default postsHandler;
