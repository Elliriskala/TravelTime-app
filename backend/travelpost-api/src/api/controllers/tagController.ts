import {Request, Response, NextFunction} from 'express';
import {
  fetchAllTags,
  fetchTagsByPostId,
  postTag,
  deleteTag,
} from '../models/tagModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {Tag, TagResult, TokenContent} from 'hybrid-types/DBTypes';
import CustomError from '../../classes/CustomError';

/**
 * Get all tags
 * @param req
 * @param res
 * @param next
 */
const getAllTags = async (
  req: Request,
  res: Response<Tag[]>,
  next: NextFunction,
) => {
  try {
    const tags = await fetchAllTags();
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

/**
 * get tags/categories based on a post id
 * @param req
 * @param res
 * @param next
 */
const getTagsWithPostId = async (
  req: Request<{post_id: string}>,
  res: Response<TagResult[]>,
  next: NextFunction,
) => {
  try {
    const tags = await fetchTagsByPostId(Number(req.params.post_id));
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

/**
 * add a tag/category on a post
 * @param req
 * @param res
 * @param next
 */
const tagPost = async (
  req: Request<object, object, {tag_name: string; post_id: string}>,
  res: Response<void>,
  next: NextFunction,
) => {
  try {
    const result = await postTag(req.body.tag_name, Number(req.body.post_id));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tags/categories (for admins)
 * @param req
 * @param res
 * @param next
 */
const tagDelete = async (
  req: Request<{tag_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    if (res.locals.user.level_name !== 'Admin') {
      throw new CustomError('Not authorized', 401);
    }
    const result = await deleteTag(Number(req.params.tag_id));
    res.json(result);
  } catch (error) {
    next(error);
  }
};


export {
  getAllTags,
  getTagsWithPostId,
  tagPost,
  tagDelete,
};
