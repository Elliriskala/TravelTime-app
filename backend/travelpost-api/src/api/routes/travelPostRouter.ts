import express from 'express';
import {
  mediaListGet,
  mediaGet,
  mediaByDestinationGet,
  mediaByTagsGet,
  mediaPost,
  mediaDelete,
  mediaByUserGet,
  mediaListMostLikedGet,
} from '../controllers/travelPostController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

// route to get all posts and post a travel post
router
  .route('/')
  .get(
    validationErrors,
    mediaListGet,
  )
  .post(
    authenticate,
    body('filename')
      .trim()
      .notEmpty()
      .isString()
      .matches(/^[\w.-]+$/)
      .escape(),
    body('media_type').trim().notEmpty().isMimeType(),
    body('continent')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 3, max: 50})
      .escape(),
    body('country')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 3, max: 50})
      .escape(),
    body('city')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 3, max: 50})
      .escape(),
    body('start_date').trim().isISO8601().toDate(),
    body('end_date').trim().isISO8601().toDate(),
    body('description')
      .trim()
      .notEmpty()
      .isString()
      .isLength({max: 300})
      .escape(),
    validationErrors,
    mediaPost,
  );

// route to get all posts based on a user id
router.route('/byuser/:user_id').get(mediaByUserGet);

// route to get a post based on its id and delete a travel post
router
  .route('/:post_id')
  .get(param('post_id').isInt({min: 1}).toInt(), validationErrors, mediaGet)
  .delete(
    authenticate,
    param('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    mediaDelete,
  );

// route to get all posts based on a destination
router
  .route('/bydestination/:filterValue')
  .get(
    param('filterValue').isString().isLength({min: 3, max: 50}).escape(),
    validationErrors,
    mediaByDestinationGet,
  );

// route to get all posts based on a tag
router
  .route('/bytags/:tag_name')
  .get(
    param('tag_name').isString().isLength({min: 3, max: 50}).escape(),
    validationErrors,
    mediaByTagsGet,
  );

// route to get the most liked posts
router.route('/mostliked').get(mediaListMostLikedGet);

export default router;
