import {ERROR_MESSAGES} from '../../utils/errorMessages';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {TravelPost, UserLevel} from 'hybrid-types/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {fetchData} from '../../lib/functions';
import {fetchTagsByPostId, postTag} from './tagModel';

const uploadPath = process.env.UPLOAD_URL;

// Common SQL fragments
// if mediaItem is an image add '-thumb.png' to filename
// if mediaItem is not image add screenshots property with 5 thumbnails
// uploadPath needs to be passed to the query
// Example usage:
// ....execute(BASE_MEDIA_QUERY, [uploadPath, otherParams]);
const BASE_MEDIA_QUERY = `
  SELECT
    TravelPosts.post_id,
    user_id,
    filename,
    media_type,
    continent,
    country,
    city,
    start_date,
    end_date,
    description,
    created_at,
    CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename) AS filename,
    CASE
      WHEN media_type LIKE '%image%'
      THEN CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename, '-thumb.png')
      ELSE CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename, '-animation.gif')
    END AS thumbnail,
    CASE
      WHEN media_type NOT LIKE '%image%'
      THEN (
        SELECT JSON_ARRAY(
          CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename, '-thumb-1.png'),
          CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename, '-thumb-2.png'),
          CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename, '-thumb-3.png'),
          CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename, '-thumb-4.png'),
          CONCAT('https://ucad-server-https.northeurope.cloudapp.azure.com/uploads/', filename, '-thumb-5.png')
        )
      )
      ELSE NULL
    END AS screenshots
  FROM TravelPosts`;

/**
 * fetch all travelposts
 * @returns - a list of all travel posts
 */
const fetchAllMedia = async (): Promise<TravelPost[]> => {
  const sql = `${BASE_MEDIA_QUERY}`;
  const params = [uploadPath];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & TravelPost[]>(stmt);
  // display the posts, so that the newest post is first
  rows.reverse();
  return rows;
};

/**
 * fetch a travel post based on its id
 * @param id - post_id
 * @returns - travel post by the searched id
 */
const fetchMediaById = async (id: number): Promise<TravelPost> => {
  const sql = `${BASE_MEDIA_QUERY}
              WHERE post_id=?`;
  const params = [id];
  const stmt = promisePool.format(sql, params);
  const [rows] = await promisePool.execute<RowDataPacket[] & TravelPost[]>(
    stmt,
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NOT_FOUND, 404);
  }

  const post = rows[0];

  const postWithTags = await fetchTagsByPostId(id);

  post.tags = postWithTags.map((row) => row.tag_name);

  return post;
};

/**
 * Fetch travel posts based on a filter value
 * @param filterValue - the value of the filter
 * @returns - a list of posts based on the filter
 */
const fetchTravelPostsByDestination = async (
  filterValue: string,
): Promise<TravelPost[]> => {
  const sql = `${BASE_MEDIA_QUERY}
    WHERE continent LIKE ? OR country LIKE ? OR city LIKE ?`;
  const params = [`%${filterValue}%`, `%${filterValue}%`, `%${filterValue}%`];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & TravelPost[]>(
    stmt,
  );

  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NOT_FOUND, 404);
  }
  return rows;
};

/**
 * Fetch travel posts based on tags
 * @param tag_name - the tag name
 * @returns - a list of posts based on the tag
 */
const fetchTravelPostByTags = async (
  tag_name: string,
): Promise<TravelPost[]> => {
  const sql = `${BASE_MEDIA_QUERY}
    JOIN PostTags ON TravelPosts.post_id = PostTags.post_id
    JOIN Tags ON PostTags.tag_id = Tags.tag_id
    WHERE Tags.tag_name = ?;`;
  const params = [tag_name];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & TravelPost[]>(
    stmt,
  );

  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NOT_FOUND, 404);
  }
  return rows;
};

/**
 * Post a new travel post
 * @param post - the post to be added
 * @returns - success/error message
 */
const postMedia = async (
  post: Omit<
    TravelPost,
    'post_id' | 'created_at' | 'thumbnail' | 'screenshots'
  >,
): Promise<TravelPost> => {
  const {
    user_id,
    filename,
    media_type,
    continent,
    country,
    city,
    start_date,
    end_date,
    description,
    tags,
  } = post;

  const connection = await promisePool.getConnection();
  await connection.beginTransaction();

  try {
    const sql = `INSERT INTO TravelPosts (user_id, filename, media_type, continent, country, city, start_date, end_date, description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      user_id,
      filename,
      media_type,
      continent,
      country,
      city,
      start_date,
      end_date,
      description,
    ];
    const stmt = promisePool.format(sql, params);
    const [newPost] = await promisePool.execute<ResultSetHeader>(stmt);

    if (newPost.affectedRows === 0) {
      throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NOT_CREATED, 500);
    }

    const postId = newPost.insertId;

    // Add tags to the post
    if (tags) {
      const tagList = tags
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);
      for (const tag of tagList) {
        await postTag(tag, postId);
      }
    }

    await connection.commit();

    return await fetchMediaById(postId);
  } catch (error) {
    await connection.rollback();
    console.error('Error inserting post:', (error as Error).message);
    throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NOT_CREATED, 500);
  } finally {
    connection.release();
  }
};

/**
 * Delete a travel post
 * @param post_id
 * @param user_id
 * @param token
 * @param level_name
 * @returns success/error message
 */
const deleteMedia = async (
  post_id: number,
  user_id: number,
  token: string,
  level_name: UserLevel['level_name'],
): Promise<MessageResponse> => {
  const post = await fetchMediaById(post_id);

  if (!post) {
    return {message: 'Posts not found'};
  }

  post.filename = post?.filename.replace(process.env.UPLOAD_URL as string, '');

  const connection = await promisePool.getConnection();

  await connection.beginTransaction();

  await connection.execute('DELETE FROM Likes WHERE post_id = ?;', [post_id]);

  await connection.execute('DELETE FROM Comments WHERE post_id = ?;', [
    post_id,
  ]);

  await connection.execute('DELETE FROM PostTags WHERE post_id = ?;', [
    post_id,
  ]);

  const sql =
    level_name === 'Admin'
      ? connection.format('DELETE FROM TravelPosts WHERE post_id = ?', [
          post_id,
        ])
      : connection.format(
          'DELETE FROM TravelPosts WHERE post_id = ? AND user_id = ?',
          [post_id, user_id],
        );

  const [result] = await connection.execute<ResultSetHeader>(sql);

  if (result.affectedRows === 0) {
    return {message: 'Post not deleted'};
  }

  const options = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  try {
    const deleteResult = await fetchData<MessageResponse>(
      `${process.env.UPLOAD_SERVER}/delete/${post.filename}`,
      options,
    );

    console.log('Travel post delete result', deleteResult);
    return deleteResult;
  } catch (e) {
    console.error('deleteMedia file delete error:', (e as Error).message);
  }

  await connection.commit();

  return {
    message: 'Post deleted',
  };
};

/**
 * Fetch all travelposts based on a user id
 * @param user_id - user id
 * @returns - all the posts based on a user id
 */
const fetchMediaByUserId = async (user_id: number): Promise<TravelPost[]> => {
  const sql = `${BASE_MEDIA_QUERY} WHERE user_id = ?`;
  const params = [user_id];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & TravelPost[]>(
    stmt,
  );
  rows.reverse();
  return rows;
};

/**
 * Fetch the most liked media
 * @returns - the most liked media
 */
const fetchMostLikedMedia = async (): Promise<TravelPost> => {
  // you could also use a view for this
  const sql = `${BASE_MEDIA_QUERY}
     WHERE post_id = (
       SELECT post_id FROM Likes
       GROUP BY post_id
       ORDER BY COUNT(*) DESC
       LIMIT 1
     )`;
  const params = [uploadPath];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<
    RowDataPacket[] & TravelPost[] & {likes_count: number}
  >(stmt);

  if (!rows.length) {
    throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NOT_FOUND_LIKED, 404);
  }
  return rows[0];
};

/**
 * Fetch travelpost owner based on a comment_id
 * @param comment_id - comment id
 * @returns - the owner of a post based on the comment id
 */

const fetchPostOwnerByCommentId = async (
  comment_id: number,
): Promise<{user_id: number} | null> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & {user_id: number}[]
  >(
    `
              SELECT TravelPosts.user_id FROM TravelPosts
              JOIN Comments ON Comments.post_id = TravelPosts.post_id
              WHERE Comments.comment_id = ?`,
    [comment_id],
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.TRAVELPOST.NOT_FOUND, 404);
  }
  return rows[0];
};

export {
  fetchAllMedia,
  fetchMediaById,
  fetchTravelPostsByDestination,
  fetchTravelPostByTags,
  postMedia,
  deleteMedia,
  fetchMostLikedMedia,
  fetchMediaByUserId,
  fetchPostOwnerByCommentId,
};
