import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Comment, UserLevel} from 'hybrid-types/DBTypes';
import {promisePool} from '../database';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

/**
 * Fetch a list of comments
 * @returns all comments
 */
const fetchAllComments = async (): Promise<Comment[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments',
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_FOUND, 404);
  }
  return rows;
};

/**
 * Fetch a list of comments by post id
 * @param post_id
 * @returns all comments on a post based on its id
 */
const fetchCommentsByPostId = async (post_id: number): Promise<Comment[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments WHERE post_id = ?',
    [post_id],
  );
  return rows;
};

/**
 * Fetch a list of comments by user id
 * @param user_id
 * @returns list of comments made by user
 */
const fetchCommentsByUserId = async (user_id: number): Promise<Comment[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments WHERE user_id = ?',
    [user_id],
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_FOUND_USER, 404);
  }
  return rows;
};

/**
 * Fetch a comment by id
 * @param comment_id
 * @returns comment based on the id
 */
const fetchCommentById = async (comment_id: number): Promise<Comment> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments WHERE comment_id = ?',
    [comment_id],
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_FOUND, 404);
  }
  return rows[0];
};

/**
 * Post a new comment on a post or answer to a comment
 * @param post_id
 * @param user_id
 * @param comment_text
 * @returns success/error message
 */
const postComment = async (
  post_id: number,
  user_id: number,
  comment_text: string,
): Promise<MessageResponse> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO Comments (post_id, user_id, comment_text) VALUES (?, ?, ?)',
    [post_id, user_id, comment_text],
  );
  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_CREATED, 500);
  }
  return {message: 'Comment added'};
};

/**
 * Delete a comment
 * @param comment_id
 * @param user_id
 * @param user_level
 * @returns success/error message
 */
const deleteComment = async (
  comment_id: number,
  user_id: number,
  user_level: UserLevel['level_name'],
  post_owner_id: number,
): Promise<MessageResponse> => {
  let sql = '';
  if (user_level === 'Admin' || user_id === post_owner_id) {
    sql = 'DELETE FROM Comments WHERE comment_id = ?';
  } else {
    sql = 'DELETE FROM Comments WHERE comment_id = ? AND user_id = ?';
  }
  const params =
    user_level === 'Admin' || user_id === post_owner_id
      ? [comment_id]
      : [comment_id, user_id];

  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_DELETED, 404);
  }
  return {message: 'Comment deleted'};
};

export {
  fetchAllComments,
  fetchCommentsByPostId,
  fetchCommentsByUserId,
  fetchCommentById,
  postComment,
  deleteComment,
};
