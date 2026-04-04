import multer from 'multer';
import express from 'express';
import {createThumbnail} from '../../middlewares/upload.js';

import {
  getCats,
  getCatById,
  getCatsByUser,
  addCat,
  updateCat,
  deleteCat,
} from '../controllers/catController.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const upload = multer({dest: 'uploads/'});

const router = express.Router();

router.get('/', getCats);
router.get('/:id', getCatById);
router.get('/user/:id', getCatsByUser);
router.post(
  '/',
  upload.single('cat'),
  authenticateToken,
  createThumbnail,
  addCat
);
router.put('/:id', authenticateToken, updateCat);
router.delete('/:id', authenticateToken, deleteCat);

export default router;
