import {expect} from '@jest/globals';
import {Express} from 'express';
import request from 'supertest';
import {UserWithLevel, UserWithNoPassword} from 'hybrid-types/DBTypes';
import {UserResponse, LoginResponse} from 'hybrid-types/MessageTypes';

const createUser = (
  url: string | Express,
  path: string,
  user: Pick<UserWithLevel, 'username' | 'email' | 'password_hash'>,
): Promise<UserWithLevel> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: UserResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          if (!result.user) {
            reject(new Error('User not created'));
          }
          const userData = result.user as UserWithLevel;
          expect(userData.user_id).toBeGreaterThan(0);
          expect(userData.username).toBe(user.username);
          expect(userData.email).toBe(user.email.toLowerCase());
          expect(userData.created_at).toBeDefined();
          expect(userData.level_name).toBe('User');
          resolve(userData);
        }
      });
  });
};

const fetchAllUsers = (
  url: string | Express,
  path: string,
): Promise<UserWithLevel[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(path)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users: UserWithLevel[] = response.body;
          users.forEach((user) => {
            expect(user).toHaveProperty('user_id');
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('created_at');
            expect(user).toHaveProperty('level_name');
          });
          resolve(users);
        }
      });
  });
};

const fetchUserById = (
  url: string | Express,
  path: string,
  user_id: number,
): Promise<UserWithLevel> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get(`${path}/${user_id}`)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user: UserWithLevel = response.body;
          expect(user.user_id).toBe(user_id);
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('created_at');
          expect(user).toHaveProperty('level_name');
          resolve(user);
        }
      });
  });
};

const login = (
  url: string | Express,
  path: string,
  user: Pick<UserWithLevel, 'username' | 'password_hash'>,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post(path)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: LoginResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          expect(result).toHaveProperty('token');
          if (!result.user) {
            reject(new Error('User not created'));
          }
          const userData = result.user as UserWithLevel;
          expect(userData.user_id).toBeGreaterThan(0);
          expect(userData.username).toBe(user.username);
          expect(userData.email).toBeDefined();
          expect(userData.created_at).toBeDefined();
          expect(userData.level_name).toBe('User');
          resolve(result.token);
        }
      });
  });
};

const updateUser = (
  url: string | Express,
  path: string,
  token: string,
  user: Pick<UserWithNoPassword, 'username' | 'email'>,
) => {
  return new Promise((resolve, reject) => {
    request(url)
      .put(path)
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: UserResponse = response.body;
          console.log('result body', result)
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          if (!result.user) {
            reject(new Error('User not updated'));
          }
          const userData = result.user as UserWithNoPassword;
          console.log('userdata', userData)
          expect(userData.user_id).toBeGreaterThan(0);
          expect(userData.username).toBe(user.username);
          expect(userData.email).toBe(user.email);
          expect(userData.created_at).toBeDefined();
          expect(userData.level_name).toBe('User');
          resolve(userData);
        }
      });
  });
};

const deleteUser = (url: string | Express, path: string, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete(path)
      .set('Authorization', token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result: UserResponse = response.body;
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('user');
          const userData = result.user as UserWithLevel;
          expect(userData.user_id).toBeGreaterThan(0);
          resolve(userData);
        }
      });
  });
};

export {
  fetchAllUsers,
  fetchUserById,
  createUser,
  login,
  updateUser,
  deleteUser,
};
