import express from 'express';
import {
  getAllUsers,
  getUserById,
  postNewUser,
  userUpdate,
  userDelete,
  userDeleteAsAdmin,
  checkToken,
  checkEmailExists,
  checkUsernameExists,
} from '../controllers/userController';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

// route to get all users
router.get('/', getAllUsers);

// route to create a new user
router.post(
  '/',
  body('username')
    .trim()
    .escape()
    .isLength({min: 3, max: 15})
    .withMessage('Username must be between 3-15 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores and dashes',
    ),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  body('password_hash')
    .isString()
    .isLength({min: 10, max: 100})
    .withMessage('Password must be at least 10 characters long'),
  validationErrors,
  postNewUser,
);

// route to update an user
router.put(
  '/',
  authenticate,
  body('profile_picture').optional().isString(),
  body('username')
    .optional()
    .trim()
    .escape()
    .isLength({min: 3, max: 15})
    .withMessage('Username must be between 3-15 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores and dashes',
    ),
  body('email')
    .optional({nullable: true})
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  body('password_hash')
    .optional()
    .isString()
    .isLength({min: 10, max: 100})
    .withMessage('Password must be at least 10 characters long'),
  body('profile_info').optional().isString(),
  validationErrors,
  userUpdate,
);

// route to delete user
router.delete('/', authenticate, userDelete);

// route to check token
router.get('/token', authenticate, checkToken);

// route to get user by their id
router
  .route('/:user_id')
  .get(param('user_id').isNumeric(), validationErrors, getUserById);

// route to delete user as an admin
router
  .route('/:user_id')
  .delete(
    authenticate,
    param('user_id').isNumeric(),
    validationErrors,
    userDeleteAsAdmin,
  );

// route to check if email exists
router.get(
  '/email/:email',
  param('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format'),
  validationErrors,
  checkEmailExists,
);

// route to check if username exists
router.get(
  '/username/:username',
  param('username')
    .trim()
    .escape()
    .isLength({min: 3, max: 15})
    .withMessage('Username must be between 3-15 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores and dashes',
    ),
  validationErrors,
  checkUsernameExists,
);

export default router;
