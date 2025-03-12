import express from 'express';
import {
  getAllLikes,
  getAllLikesByPostId,
  getAllLikesByUserId,
  getLikeByPostIdAndUserId,
  likePost,
  likeDelete,
  getLikesCountByPostId,
} from '../controllers/likeController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

// route to get all likes, and post a like
router
  .route('/')
  .get(getAllLikes)
  .post(
    authenticate,
    body('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    likePost,
  );

// route to get likes based on a post id
router
  .route('/bypost/:post_id')
  .get(
    param('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    getAllLikesByPostId,
  );

// route to get all likes based on user id
router
  .route('/byuser/:user_id')
  .get(
    authenticate,
    param('user_id').isInt({min: 1}).toInt(),
    validationErrors,
    getAllLikesByUserId,
  );

// route to get a like based on a post id and user id
router
  .route('/bypost/user/:post_id')
  .get(
    authenticate,
    param('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    getLikeByPostIdAndUserId,
  );

// route to count all likes based on a post id
router
  .route('/count/:post_id')
  .get(
    param('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    getLikesCountByPostId,
  );

// route to unlike a post
router
  .route('/:post_id')
  .delete(
    authenticate,
    param('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    likeDelete,
  );

export default router;
