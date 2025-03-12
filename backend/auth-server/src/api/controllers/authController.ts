import {UserWithLevel, TokenContent} from 'hybrid-types/DBTypes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {LoginResponse} from 'hybrid-types/MessageTypes';
import {fetchUserByUsername} from '../models/userModel';

/**
 * Login
 * @param req
 * @param res
 * @param next
 * @returns token if log in was successful
 */
const login = async (
  req: Request<object, object, {username: string; password_hash: string}>,
  res: Response<LoginResponse>,
  next: NextFunction,
) => {
  try {
    const {username, password_hash} = req.body;
    const user = await fetchUserByUsername(username);

    // compare the hashed password
    if (!bcrypt.compareSync(password_hash, user.password_hash)) {
      next(new CustomError('Incorrect username/password', 403));
      return;
    }

    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }

    const outUser: Omit<UserWithLevel, 'password_hash'> = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture,
      profile_info: user.profile_info,
      created_at: user.created_at,
      level_name: user.level_name,
    };

    // user from token
    const tokenContent: TokenContent = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      level_name: user.level_name,
    };

    const token = jwt.sign(tokenContent, process.env.JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: outUser,
    });
  } catch {
    next(new CustomError('Incorrect username/password', 403));
  }
};

export {login};
