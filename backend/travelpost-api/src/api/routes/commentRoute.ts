import express from 'express';
import {
  getAllComments,
  getAllCommentsByPostId,
  getAllCommentsByUserId,
  getComment,
  commentPost,
  commentDelete,
} from '../controllers/commentController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

// route to get all comment and post a comment
router
  .route('/')
  .get(getAllComments)
  .post(
    authenticate,
    body('comment_text')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 1, max: 200})
      .escape(),
    body('post_id').notEmpty().isInt({min: 1}).toInt(),
    validationErrors,
    commentPost,
  );

// route to get comments by post id
router
  .route('/bypost/:post_id')
  .get(
    param('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    getAllCommentsByPostId,
  );

// route to get all comments by user id
router.route('/byuser').get(authenticate, getAllCommentsByUserId);

// route to get a comment by its id and to delete a comment
router
  .route('/:comment_id')
  .get(
    param('comment_id').isInt({min: 1}).toInt(),
    validationErrors,
    getComment,
  )
  .delete(
    authenticate,
    param('comment_id').isInt({min: 1}).toInt(),
    validationErrors,
    commentDelete,
  );

export default router;
