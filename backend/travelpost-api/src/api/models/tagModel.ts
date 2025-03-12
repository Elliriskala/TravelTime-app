import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Tag, TagResult} from 'hybrid-types/DBTypes';
import {promisePool} from '../database';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

/**
 * Fetch all possible tags/categories
 * @returns all vacation/destination categories
 */
const fetchAllTags = async (): Promise<Tag[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Tag[]>(
    'SELECT * FROM Tags',
  );
  return rows;
};

/**
 * Add a tag to a travel post
 * @param tag_name
 * @param post_id
 * @returns success/error message
 */
const postTag = async (tag_name: string, post_id: number): Promise<void> => {
  try {
    // check if tag exists (case insensitive)
    const [tagResult] = await promisePool.query<RowDataPacket[]>(
      'SELECT tag_id FROM Tags WHERE tag_name = ?',
      [tag_name],
    );

    let tag_id: number;

    if (tagResult.length > 0) {
      tag_id = tagResult[0].tag_id;
    } else {
      const [newTag] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO Tags (tag_name) VALUES (?)',
        [tag_name],
      );

      if (newTag.affectedRows === 0) {
        throw new CustomError(ERROR_MESSAGES.TAG.NOT_CREATED, 500);
      }

      tag_id = newTag.insertId;
    }

    await promisePool.execute<ResultSetHeader>(
      'INSERT IGNORE INTO PostTags (post_id, tag_id) VALUES (?, ?)',
      [post_id, tag_id],
    );
  } catch {
    throw new CustomError(ERROR_MESSAGES.TAG.NOT_CREATED, 500);
  }
};

/**
 * Fetch all the tags based on a post id
 * @param id
 * @returns the tags/categories included in a post
 */
const fetchTagsByPostId = async (post_id: number): Promise<TagResult[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & TagResult[]>(
    `SELECT
        Tags.tag_id,
        Tags.tag_name,
        PostTags.post_id
     FROM Tags
     JOIN PostTags ON Tags.tag_id = PostTags.tag_id
     WHERE PostTags.post_id = ?`,
    [post_id],
  );
  return rows;
};

/**
 * Admins can delete tags
 * @param tag_id
 * @returns success/error message
 */
const deleteTag = async (id: number): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  await connection.beginTransaction();

  try {
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Tags WHERE tag_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      throw new CustomError(ERROR_MESSAGES.TAG.NOT_DELETED, 404);
    }

    await connection.commit();
    return {message: 'Tag deleted'};
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export {fetchAllTags, postTag, fetchTagsByPostId, deleteTag};
