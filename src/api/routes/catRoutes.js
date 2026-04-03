import multer from 'multer';
import express from 'express';
import {createThumbnail} from '../../middlewares/upload.js';

import {
  getCats,
  getCatById,
  addCat,
  updateCat,
  deleteCat,
} from '../controllers/catController.js';

const upload = multer({dest: 'uploads/'});

const router = express.Router();

router.get('/', getCats);
router.get('/:id', getCatById);
router.post('/', upload.single('cat'), createThumbnail, addCat);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

export default router;
