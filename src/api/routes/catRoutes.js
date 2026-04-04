import express from 'express';
import {upload, createThumbnail} from '../../middlewares/upload.js';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

import {
  getCats,
  getCatById,
  getCatsByUser,
  addCat,
  updateCat,
  deleteCat,
} from '../controllers/catController.js';

import {authenticateToken} from '../../middlewares/authentication.js';

const router = express.Router();

router.get('/', getCats);
router.get('/:id', getCatById);
router.get('/user/:id', getCatsByUser);

router.post(
  '/',
  authenticateToken,
  upload.single('file'),
  createThumbnail,
  body('name').trim().isLength({min: 3, max: 50}),
  body('weight').isNumeric(),
  body('owner').isInt(),
  body('birthdate').isISO8601(),
  validationErrors,
  addCat
);

router.put(
  '/:id',
  authenticateToken,
  body('name').optional().trim().isLength({min: 3, max: 50}),
  body('weight').optional().isNumeric(),
  body('birthdate').optional().isISO8601(),
  validationErrors,
  updateCat
);

router.delete('/:id', authenticateToken, deleteCat);

export default router;
