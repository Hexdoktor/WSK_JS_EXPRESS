import express from 'express';
import {
  getCats,
  getCatById,
  addCat,
  updateCat,
  deleteCat,
} from '../controllers/catController.js';

const router = express.Router();

router.get('/', getCats);
router.get('/:id', getCatById);
router.post('/', addCat);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

export default router;
