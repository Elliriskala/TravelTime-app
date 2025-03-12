import bcrypt from 'bcryptjs';
import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {
  AvailableResponse,
  UserDeleteResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';
import {TokenContent, User, UserWithNoPassword} from 'hybrid-types/DBTypes';
import {
  fetchAllUsers,
  fetchUserById,
  fetchUsername,
  fetchEmail,
  createUser,
  updateUser,
  deleteUser,
} from '../models/userModel';

const salt = bcrypt.genSaltSync(10);

/**
 * Get all users
 * @param req
 * @param res
 * @param next
 */
const getAllUsers = async (
  req: Request,
  res: Response<UserWithNoPassword[]>,
  next: NextFunction,
) => {
  try {
    const allUsers = await fetchAllUsers();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by their id
 * @param req
 * @param res
 * @param next
 */
const getUserById = async (
  req: Request<{user_id: string}>,
  res: Response<UserWithNoPassword>,
  next: NextFunction,
) => {
  try {
    const singleUser = await fetchUserById(Number(req.params.user_id));
    res.json(singleUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 * @param req
 * @param res
 * @param next
 * @returns new user
 */

const postNewUser = async (
  req: Request<object, object, User>,
  res: Response<UserResponse>,
  next: NextFunction,
) => {
  try {
    const user = req.body;
    // hash the password
    user.password_hash = await bcrypt.hash(user.password_hash, salt);

    // create the user
    const newUser = await createUser(user);
    if (!newUser) {
      next(new CustomError('User not created', 500));
      return;
    }

    // successfully created user response
    const response: UserResponse = {
      message: 'user created',
      user: newUser,
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

/**
 * Update an user
 * @param req
 * @param res
 * @param next
 * @returns updated user
 */
const userUpdate = async (
  req: Request<object, object, User>,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    // get the user from token
    const userFromToken = res.locals.user;
    const user = req.body;

    // check if the username or email already exists
    if (user.username && user.username !== userFromToken.username) {
      const existingUsername = await fetchUsername(user.username);
      if (existingUsername) {
        return next(new CustomError('Username already exists', 400));
      }
    }

    if (user.email && user.email !== userFromToken.email) {
      const existingEmail = await fetchEmail(user.email);
      if (existingEmail) {
        return next(new CustomError('Email already exists', 400));
      }
    }

    // hash the password if updated
    if (user.password_hash) {
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }

    // update the user
    const updatedUser = await updateUser(user, userFromToken.user_id);
    if (!updatedUser) {
      return next(new CustomError('User not found', 404));
    }

    const response: UserResponse = {
      message: 'User updated successfully',
      user: updatedUser,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @param req
 * @param res
 * @param next
 * @returns user deleted message
 */
const userDelete = async (
  req: Request,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;

    const result = await deleteUser(userFromToken.user_id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete other users as an admin
 * @param req
 * @param res
 * @param next
 * @returns
 */
const userDeleteAsAdmin = async (
  req: Request<{user_id: string}>,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    if (res.locals.user.level_name !== 'Admin') {
      next(new CustomError('You are not authorized to do this', 401));
      return;
    }

    const result = await deleteUser(Number(req.params.user_id));

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Check token
 * @param req
 * @param res
 * @param next
 * @returns success/error message
 */
const checkToken = async (
  req: Request,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  const userFromToken = res.locals.user;
  // check if user exists in database
  const user = await fetchUserById(userFromToken.user_id);
  if (!user) {
    next(new CustomError('Incorrect username/password', 403));
    return;
  }

  const message: UserResponse = {
    message: 'Token is valid',
    user: user,
  };
  res.json(message);
};

/**
 * Check if the email is available
 * @param req
 * @param res
 * @return {Boolean} Available: True/False
 */
const checkEmailExists = async (
  req: Request<{email: string}>,
  res: Response<AvailableResponse>,
) => {
  try {
    const user = await fetchEmail(req.params.email);
    res.json({available: !user});
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({available: true});
  }
};

/**
 * Check if the username is available
 * @param req
 * @param res
 * @return {Boolean} Available: True/False
 */
const checkUsernameExists = async (
  req: Request<{username: string}>,
  res: Response<AvailableResponse>,
) => {
  try {
    const user = await fetchUsername(req.params.username);
    res.json({available: !user});
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({available: true});
  }
};

export {
  getAllUsers,
  getUserById,
  postNewUser,
  userUpdate,
  userDelete,
  userDeleteAsAdmin,
  checkToken,
  checkEmailExists,
  checkUsernameExists,
};
