import {promisePool} from '../database';
import CustomError from '../../classes/CustomError';
import {UserWithNoPassword, User, UserWithLevel} from 'hybrid-types/DBTypes';
import {RowDataPacket, ResultSetHeader} from 'mysql2';
import {UserDeleteResponse} from 'hybrid-types/MessageTypes';

/**
 * Get all users
 * @returns list of all users (without passwords) or an empty array if no users found
 */
const fetchAllUsers = async (): Promise<UserWithNoPassword[]> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & UserWithNoPassword[]
  >(`
        SELECT
            Users.user_id,
            Users.username,
            Users.email,
            Users.profile_picture,
            Users.profile_info,
            Users.created_at,
            UserLevels.level_name
        FROM Users
        JOIN UserLevels ON Users.user_level_id = UserLevels.level_id`);
  return rows;
};

/**
 * Get user by their user_id
 * @param user_id - user id
 * @returns user and their info without the password
 */
const fetchUserById = async (user_id: number): Promise<UserWithNoPassword> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
    `SELECT
      Users.user_id,
      Users.username,
      Users.email,
      Users.profile_picture,
      Users.profile_info,
      Users.created_at,
      UserLevels.level_name
    FROM Users
    JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
    WHERE Users.user_id = ?`,
    [user_id],
  );
  // if no users
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  // return the user from the id
  return rows[0];
};

/**
 * Fetch user by their username for loging in
 * @param username
 * @returs user with their info
 */
const fetchUserByUsername = async (
  username: string,
): Promise<UserWithLevel> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel>(
    `
    SELECT
        Users.user_id,
        Users.username,
        Users.email,
        Users.password_hash,
        Users.profile_picture,
        Users.profile_info,
        Users.created_at,
        UserLevels.level_name
    FROM Users
    JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
    WHERE Users.username = ?`,
    [username],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  // return the user
  return rows[0] as UserWithLevel;
};

/**
 * Check if the username exists in the database
 * @param username
 * @returns {Boolean} true if username exists, false if not
 */
const fetchUsername = async (
  username: string,
): Promise<UserWithLevel | null> => {
  const connection = await promisePool.getConnection();
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
      `SELECT Users.user_id, Users.username, Users.email, Users.password_hash, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.username = ?`,
      [username],
    );

    // if no users return null = username available
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching username:', error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Check is the email exists in the database
 * @param email
 * @returns {Boolean} true if email exists, false if not
 */

const fetchEmail = async (email: string): Promise<UserWithLevel | null> => {
  const connection = await promisePool.getConnection();
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
      `SELECT Users.user_id, Users.username, Users.email, Users.password_hash, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.email = ?`,
      [email],
    );

    // if no emails return null = email available
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching email:', error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Create a new user
 * @param user
 * @param user_level_id
 * @returns the new created user's id
 */
const createUser = async (
  user: Pick<User, 'username' | 'email' | 'password_hash'>,
  user_level_id = 2,
): Promise<UserWithNoPassword> => {
  const sql = `
    INSERT INTO Users
        (username, email, password_hash, user_level_id)
    VALUES (?, ?, ?, ?)`;

  // new user info
  const newUser = promisePool.format(sql, [
    user.username,
    user.email,
    user.password_hash,
    user_level_id,
  ]);

  // create the user with the info
  const [result] = await promisePool.execute<ResultSetHeader>(newUser);

  if (result.affectedRows === 0) {
    throw new CustomError('User not created', 500);
  }

  return await fetchUserById(result.insertId);
};

/**
 * Update user info
 * @param user
 * @param id - The ID of the user being updated
 * @returns updated user
 */

const updateUser = async (
  user: Partial<User>,
  user_id: number,
): Promise<UserWithNoPassword> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    // define the fields that can be updated
    const allowedFields = [
      'profile_picture',
      'username',
      'email',
      'password_hash', // if password is updated the hashing is handled in the controller
      'profile_info',
    ];

    // check if there is any fields to update
    const updates = Object.entries(user)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key]) => `${key} = ?`);
    const values = Object.entries(user)
      .filter(([key]) => allowedFields.includes(key))
      .map(([, value]) => value);

    // if no update fields selected
    if (updates.length === 0) {
      throw new CustomError('No valid fields to update', 400);
    }

    // perform the update query
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`,
      [...values, user_id],
    );

    if (result.affectedRows === 0) {
      throw new CustomError('User not updated', 500);
    }

    // fetch the updated user data (without password)
    const updatedUser = await fetchUserById(user_id);

    // if the updates where successful, commit the transaction
    await connection.commit();
    return updatedUser;
  } finally {
    connection.release();
  }
};

/**
 * Delete user by their id
 * @param id
 * @returns message 'deleted user with their id'
 */

const deleteUser = async (id: number): Promise<UserDeleteResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?;',
      [id],
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      throw new CustomError('User not deleted', 400);
    }

    return {message: 'User deleted', user: {user_id: id}};
  } finally {
    connection.release();
  }
};

export {
  fetchAllUsers,
  fetchUserById,
  fetchUserByUsername,
  fetchUsername,
  fetchEmail,
  createUser,
  updateUser,
  deleteUser,
};
