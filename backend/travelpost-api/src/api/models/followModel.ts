import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Follow} from 'hybrid-types/DBTypes';
import {promisePool} from '../database';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

/**
 * Fetch all users' followers based on their id
 * @returns all the followers
 */
const fetchAllUserFollowers = async (id: number): Promise<Follow[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Follow[]>(
      `SELECT Follows.follower_id, Users.username, Users.profile_picture
       FROM Follows
       JOIN Users ON Follows.follower_id = Users.user_id
       WHERE Follows.following_id = ?`,
      [id],
    );
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new CustomError('Failed to fetch followers', 500);
  }
};

/**
 * Fetch all users that user is following based on their user id
 * @returns all users' followings
 */
const fetchAllUserFollowings = async (id: number): Promise<Follow[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Follow[]>(
    `SELECT Follows.following_id, Users.username, Users.profile_picture
       FROM Follows
       JOIN Users ON Follows.following_id = Users.user_id
       WHERE Follows.follower_id = ?`,
    [id],
  );
  return rows;
};

/**
 * Follow a new user
 * @param follower_id
 * @param following_id
 * @returns
 */
const postFollow = async (
  follower_id: number,
  following_id: number,
): Promise<MessageResponse> => {
  const [existingFollower] = await promisePool.execute<
    RowDataPacket[] & Follow[]
  >('SELECT * FROM Follows WHERE follower_id = ? AND following_id = ?', [
    follower_id,
    following_id,
  ]);

  if (existingFollower.length > 0) {
    throw new CustomError(ERROR_MESSAGES.FOLLOW.ALREADY_EXISTS, 400);
  }

  const result = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO Follows (follower_id, following_id) VALUES (?, ?)',
    [follower_id, following_id],
  );

  if (result[0].affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.FOLLOW.NOT_CREATED, 500);
  }

  return {message: 'Follower added'};
};

/**
 * Unfollow user
 * @param follower_id
 * @param following_id
 * @returns success/error message
 */
const deletefollowing = async (
  follower_id: number,
  following_id: number,
): Promise<MessageResponse> => {
  const sql = 'DELETE FROM Follows WHERE follower_id = ? AND following_id = ?';
  const params = [follower_id, following_id];

  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.FOLLOW.NOT_DELETED, 400);
  }

  return {message: 'User unfollowed'};
};

export {
  fetchAllUserFollowers,
  fetchAllUserFollowings,
  postFollow,
  deletefollowing,
};
