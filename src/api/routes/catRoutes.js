import multer from 'multer';
import express from 'express';
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
router.post(
  '/',
  (req, res, next) => {
    console.log('MULTER DID RUN');
    next();
  },
  upload.single('cat'),
  (req, res, next) => {
    console.log('AFTER MULTER:', req.body, req.file);
    next();
  },
  addCat
);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

export default router;
