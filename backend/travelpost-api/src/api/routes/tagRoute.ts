import express from 'express';
import {
  getAllTags,
  getTagsWithPostId,
  tagPost,
  tagDelete,
} from '../controllers/tagController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

// route to get all tags, post a tag
router
  .route('/')
  .get(getAllTags)
  .post(
    authenticate,
    body('tag_name')
      .trim()
      .notEmpty()
      .isString()
      .isLength({min: 2, max: 50})
      .escape(),
    body('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    tagPost,
  );

// route to get all tags on a post
router
  .route('/bypost/:post_id')
  .get(
    param('post_id').isInt({min: 1}).toInt(),
    validationErrors,
    getTagsWithPostId,
  );

// route for admins to delete tags
router
  .route('/:id')
  .delete(
    authenticate,
    param('id').isInt({min: 1}).toInt(),
    validationErrors,
    tagDelete,
  );

export default router;
