import promisePool from '../../utils/database.js';

import {
  listAllCats,
  findCatById,
  addCat as addCatToDb,
  modifyCatByOwner,
  modifyCatAdmin,
  removeCatByOwner,
  removeCatAdmin,
} from '../models/catModel.js';

export const getCats = async (req, res, next) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

export const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);

    if (!cat) {
      const error = new Error('Cat not found');
      error.status = 404;
      return next(error);
    }

    res.json(cat);
  } catch (err) {
    next(err);
  }
};

export const getCatsByUser = async (req, res, next) => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT * FROM wsk_cats WHERE owner = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const addCat = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Invalid or missing file');
      error.status = 400;
      return next(error);
    }

    const cat = {
      cat_name: req.body.name,
      weight: req.body.weight,
      owner: req.body.owner,
      filename: req.file?.filename || null,
      birthdate: req.body.birthdate,
    };

    const result = await addCatToDb(cat);

    if (!result) {
      const error = new Error('Failed to add cat');
      error.status = 400;
      return next(error);
    }

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateCat = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const catId = req.params.id;

    let result;

    if (user.role === 'admin') {
      result = await modifyCatAdmin(req.body, catId);
    } else {
      result = await modifyCatByOwner(req.body, catId, user.user_id);
    }

    if (!result) {
      const error = new Error('Forbidden or cat not found');
      error.status = 403;
      return next(error);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteCat = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const catId = req.params.id;

    let result;

    if (user.role === 'admin') {
      result = await removeCatAdmin(catId);
    } else {
      result = await removeCatByOwner(catId, user.user_id);
    }

    if (!result) {
      const error = new Error('Forbidden or cat not found');
      error.status = 403;
      return next(error);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};
