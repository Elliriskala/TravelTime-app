import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Like} from 'hybrid-types/DBTypes';
import { promisePool } from '../database';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

/**
 * Request a list of likes
 * @returns all likes
 */
const fetchAllLikes = async (): Promise<Like[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes',
  );
  return rows;
};

/**
 * Request a list of likes by post id
 * @param post_id
 * @returns likes based on post id
 */
const fetchLikesByPostId = async (post_id: number): Promise<Like[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE post_id = ?',
    [post_id],
  );
  return rows;
};

/**
 * Request a count of likes by post id
 * @param post_id
 * @returns amout of likes on a post
 */
const fetchLikesCountByPostId = async (post_id: number): Promise<number> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & {likesCount: number}[]
  >('SELECT COUNT(*) as likesCount FROM Likes WHERE post_id = ?', [post_id]);
  return rows[0].likesCount;
};

/**
 * Request a list of likes by user id
 * @param user_id
 * @returns likes based on a user id
 */
const fetchLikesByUserId = async (user_id: number): Promise<Like[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE user_id = ?',
    [user_id],
  );
  return rows;
};

/**
 * Request a list of likes by user id and post id
 * @param user_id
 * @param post_id
 * @returns likes based on a user id and post id
 */


const fetchLikeByPostIdAndUserId = async (
  post_id: number,
  user_id: number,
): Promise<Like> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE post_id = ? AND user_id = ?',
    [post_id, user_id],
  );
  return rows[0];
};

/**
 * Like a post
 * @param post_id
 * @param user_id
 * @returns success/error message
 */
const postLike = async (
  post_id: number,
  user_id: number,
): Promise<MessageResponse> => {
  const [existingLike] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE post_id = ? AND user_id = ?',
    [post_id, user_id],
  );

  if (existingLike.length > 0) {
    throw new CustomError(ERROR_MESSAGES.LIKE.ALREADY_EXISTS, 400);
  }

  const result = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO Likes (post_id, user_id) VALUES (?, ?)',
    [post_id, user_id],
  );

  if (result[0].affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.LIKE.NOT_CREATED, 500);
  }

  return {message: 'Like added'};
};

/**
 * Unlike a post
 * @param like_id
 * @param user_id
 * @returns success/error message
 */
const deleteLike = async (
  like_id: number,
  user_id: number,
): Promise<MessageResponse> => {
  const sql = 'DELETE FROM Likes WHERE like_id = ? AND user_id = ?';

  const params = [like_id, user_id];
  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.LIKE.NOT_DELETED, 400);
  }

  return {message: 'Like deleted'};
};

export {
  fetchAllLikes,
  fetchLikesByPostId,
  fetchLikesCountByPostId,
  fetchLikesByUserId,
  fetchLikeByPostIdAndUserId,
  postLike,
  deleteLike
};
