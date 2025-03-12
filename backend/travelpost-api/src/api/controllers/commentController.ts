import {Request, Response, NextFunction} from 'express';
import {
  fetchAllComments,
  fetchCommentsByPostId,
  fetchCommentsByUserId,
  fetchCommentById,
  postComment,
  deleteComment,
} from '../models/commentModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {Comment, TokenContent} from 'hybrid-types/DBTypes';
import {fetchPostOwnerByCommentId} from '../models/travelPostModel';

/**
 * get all comments
 * @param req
 * @param res
 * @param next
 */
const getAllComments = async (
  req: Request,
  res: Response<Comment[]>,
  next: NextFunction,
) => {
  try {
    const comments = await fetchAllComments();
    if (!comments) {
      res.status(200).json([]);
    }
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * get commenst based on post id
 * @param req
 * @param res
 * @param next
 */
const getAllCommentsByPostId = async (
  req: Request<{post_id: string}>,
  res: Response<Comment[]>,
  next: NextFunction,
) => {
  try {
    const comments = await fetchCommentsByPostId(Number(req.params.post_id));
    if (!comments) {
      res.status(200).json([]);
    }
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * get comments based on user id
 * @param req
 * @param res
 * @param next
 */
const getAllCommentsByUserId = async (
  req: Request,
  res: Response<Comment[], {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const comments = await fetchCommentsByUserId(
      Number(res.locals.user.user_id),
    );
    if (!comments) {
      res.status(200).json([]);
    }
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * get a comment by its id
 * @param req
 * @param res
 * @param next
 */
const getComment = async (
  req: Request<{comment_id: string}>,
  res: Response<Comment>,
  next: NextFunction,
) => {
  try {
    const comment = await fetchCommentById(Number(req.params.comment_id));
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * post a new comment
 * @param req
 * @param res
 * @param next
 */
const commentPost = async (
  req: Request<object, object, {comment_text: string; post_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await postComment(
      Number(req.body.post_id),
      res.locals.user.user_id,
      req.body.comment_text,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * delete a comment
 * @param req
 * @param res
 * @param next
 */
const commentDelete = async (
  req: Request<{comment_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    // fetch the post owner to check if the user is the owner of the post
    const post_owner = await fetchPostOwnerByCommentId(
      Number(req.params.comment_id),
    );
    if (!post_owner) {
      res.status(404).json({message: 'Posts not found'});
      return;
    }

    const result = await deleteComment(
      Number(req.params.comment_id),
      res.locals.user.user_id,
      res.locals.user.level_name,
      post_owner.user_id,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  getAllComments,
  getAllCommentsByPostId,
  getAllCommentsByUserId,
  getComment,
  commentPost,
  commentDelete,
};
