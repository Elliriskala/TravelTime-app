import {expect, describe, it, jest} from '@jest/globals';
import app from '../src/app';
import {
  createUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  login,
} from '../test/testUser';
import {UserWithLevel, UserWithNoPassword} from 'hybrid-types/DBTypes';
import randomstring from 'randomstring';

const userPath = '/api/v1/users';
const loginPath = '/api/v1/auth/login';

jest.setTimeout(1000);

describe('GET /api/v1', () => {
  // test user
  const testuser: Pick<UserWithLevel, 'username' | 'email' | 'password_hash'> =
    {
      username: 'testuser' + randomstring.generate(5),
      email: randomstring.generate(5) + '@test.com',
      password_hash: 'testpassword',
    };

  // create user
  let user: UserWithLevel;
  it('should create a user', async () => {
    user = await createUser(app, userPath, testuser);
    expect(user).toBeDefined();
  }, 10000);

  // get all users
  it('should get all users', async () => {
    const users = await fetchAllUsers(app, '/api/v1/users');
    expect(users.length).toBeGreaterThan(0);
  });

  // get a single user by user id
  it('should get user by ID', async () => {
    console.log('user', user.user_id);
    await fetchUserById(app, '/api/v1/users/', user.user_id);
  });

  // login
  let token: string;
  it('should login', async () => {
    token = await login('http://localhost:3001', loginPath, testuser);
  });

  // updated user
  const updatedUser: Pick<UserWithNoPassword, 'username' | 'email'> = {
    username: 'updatedUser' + randomstring.generate(5),
    email: randomstring.generate(5) + '@test.com',
  };

  console.log('updated user', updatedUser)

  // update a user
  it('should update the user', async () => {
    const bearertoken = `Bearer ${token}`;
    await updateUser('http://localhost:3001', userPath, bearertoken, updatedUser) as UserWithNoPassword;
  });

  // delete user
  it('should delete user', async () => {
    const bearertoken = `Bearer ${token}`;
    await deleteUser(app, '/api/v1/users', bearertoken);
  });
});
