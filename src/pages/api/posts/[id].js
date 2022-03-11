import {dbConnect} from 'utils/dbConnect';
import Post from 'models/post';
import {authenticated} from 'service/index';

import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND
} from 'constants/responseStatus';

dbConnect();

// eslint-disable-next-line complexity, max-statements
const postHandler = authenticated(async (req, res) => {
  const {query : {id}, method} = req;

  switch (method) {
    case 'GET': {
      try {
        const post = await Post.findById(id).populate('author', 'firstName lastName');

        if (post) {
          res.status(STATUS_OK).json({
            data : post
          });
        } else {
          res.status(STATUS_NOT_FOUND).json({
            error : {
              message : 'Post not found'
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
        const post = await Post
          .findByIdAndUpdate(id, req.body, {
            new : true
          });

        if (!post) {
          res.status(STATUS_NOT_FOUND).json({
            error : {
              message : 'Post not found'
            }
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : post
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
        const deletedPost = await Post.deleteOne({_id : id});

        if (!deletedPost) {
          res.status(STATUS_NOT_FOUND).json({
            error : {
              message : 'Project not deleted'
            }
          });
          break;
        }

        res.status(STATUS_OK).json({
          data : deletedPost
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

export default postHandler;
