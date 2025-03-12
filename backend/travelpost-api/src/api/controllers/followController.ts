import {Request, Response, NextFunction} from 'express';
import {
  fetchAllUserFollowers,
  fetchAllUserFollowings,
  postFollow,
  deletefollowing,
} from '../models/followModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {Follow, TokenContent} from 'hybrid-types/DBTypes';

/**
 * get all users' followers
 * @param req
 * @param res
 * @param next
 */
const getAllFollowers = async (
  req: Request,
  res: Response<Follow[]>,
  next: NextFunction,
) => {
  try {
    const followers = await fetchAllUserFollowers(Number(req.params.user_id));
    res.json(followers);
  } catch (error) {
    next(error);
  }
};

/**
 * get all users' followings
 * @param req
 * @param res
 * @param next
 */
const getAllFollowings = async (
  req: Request,
  res: Response<Follow[]>,
  next: NextFunction,
) => {
  try {
    const followings = await fetchAllUserFollowings(Number(req.params.user_id));
    res.json(followings);
  } catch (error) {
    next(error);
  }
};

/**
 * follow new user
 * @param req
 * @param res
 * @param next
 */
const followPost = async (
  req: Request<object, object, {follower_id: number; following_id: number}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    // post a new following with the follower_id and following_id
    const result = await postFollow(
      Number(req.body.follower_id),
      Number(req.body.following_id),
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * unfollow user
 * @param req
 * @param res
 * @param next
 */
const followDelete = async (
  req: Request<object, object, {follower_id: number; following_id: number}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await deletefollowing(
      Number(req.body.follower_id),
      Number(req.body.following_id),
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {getAllFollowers, getAllFollowings, followPost, followDelete};
