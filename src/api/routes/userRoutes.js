import express from 'express';
import {body} from 'express-validator';

import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);

router.post(
  '/',
  body('email').trim().isEmail(),
  body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
  body('password').trim().isLength({min: 8}),
  validationErrors,
  addUser
);

router.put(
  '/:id',
  authenticateToken,
  body('email').optional().trim().isEmail(),
  body('username')
    .optional()
    .trim()
    .isLength({min: 3, max: 20})
    .isAlphanumeric(),
  body('password').optional().trim().isLength({min: 8}),
  validationErrors,
  updateUser
);

router.delete('/:id', authenticateToken, deleteUser);

export default router;
