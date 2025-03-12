import {Request, Response, NextFunction} from 'express';
import {
  fetchAllMedia,
  fetchMediaById,
  fetchTravelPostsByDestination,
  fetchTravelPostByTags,
  postMedia,
  deleteMedia,
  fetchMostLikedMedia,
  fetchMediaByUserId,
} from '../models/travelPostModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {TravelPost, TokenContent} from 'hybrid-types/DBTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

/**
 * get all travel posts
 * @param req
 * @param res
 * @param next
 */

const mediaListGet = async (
  req: Request,
  res: Response<TravelPost[]>,
  next: NextFunction,
) => {
  try {
    const media = await fetchAllMedia();
    res.json(media);
  } catch (error) {
    next(error);
  }
};

/**
 * get travelposts based on user id
 * @param req
 * @param res
 * @param next
 */

const mediaByUserGet = async (
  req: Request<{user_id: string}>,
  res: Response<TravelPost[], {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const user_id = Number(req.params.user_id) || res.locals.user.user_id;
    if (isNaN(user_id)) {
      throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NO_ID, 400);
    }

    const media = await fetchMediaByUserId(user_id);
    res.json(media);
  } catch (error) {
    next(error);
  }
};

/**
 * get post based on post id
 * @param req
 * @param res
 * @param next
 */

const mediaGet = async (
  req: Request<{post_id: string}>,
  res: Response<TravelPost>,
  next: NextFunction,
) => {
  try {
    const post_id = Number(req.params.post_id);
    const post = await fetchMediaById(post_id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * get posts by destination
 * @param req
 * @param res
 * @param next
 */

const mediaByDestinationGet = async (
  req: Request<{filterValue: string}>,
  res: Response<TravelPost[]>,
  next: NextFunction,
) => {
  try {
    const {filterValue} = req.params;
    const posts = await fetchTravelPostsByDestination(filterValue);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * get posts by tags
 * @param req
 * @param res
 * @param next
 */

const mediaByTagsGet = async (
  req: Request<{tag_name: string}>,
  res: Response<TravelPost[]>,
  next: NextFunction,
) => {
  try {
    const {tag_name} = req.params;
    const posts = await fetchTravelPostByTags(tag_name);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * post a travel post
 * @param req
 * @param res
 * @param next
 */

const mediaPost = async (
  req: Request<object, object, Omit<TravelPost, 'post_id' | 'created_at'>>,
  res: Response<MessageResponse & {post: TravelPost}, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    // add user_id to media object from token
    req.body.user_id = res.locals.user.user_id;
    const postItem = await postMedia(req.body);
    res.json({message: 'Media created', post: postItem});
  } catch (error) {
    next(error);
  }
};

/**
 * delete a travel post
 * @param req
 * @param res
 * @param next
 */

const mediaDelete = async (
  req: Request<{post_id: string}>,
  res: Response<MessageResponse, {user: TokenContent; token: string}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.post_id);
    const result = await deleteMedia(
      id,
      res.locals.user.user_id,
      res.locals.token,
      res.locals.user.level_name,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * get most liked travel posts
 * @param req
 * @param res
 * @param next
 */

const mediaListMostLikedGet = async (
  req: Request,
  res: Response<TravelPost>,
  next: NextFunction,
) => {
  try {
    const post = await fetchMostLikedMedia();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export {
  mediaListGet,
  mediaGet,
  mediaByDestinationGet,
  mediaByTagsGet,
  mediaPost,
  mediaDelete,
  mediaByUserGet,
  mediaListMostLikedGet,
};
