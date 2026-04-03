import promisePool from '../../utils/database.js';

import {
  listAllCats,
  findCatById,
  addCat as addCatToDb,
  modifyCat,
  removeCat,
} from '../models/catModel.js';

export const getCats = async (req, res) => {
  const cats = await listAllCats();
  res.json(cats);
};

export const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  cat ? res.json(cat) : res.sendStatus(404);
};

export const getCatsByUser = async (req, res) => {
  const [rows] = await promisePool.execute(
    `SELECT * FROM wsk_cats WHERE owner = ?`,
    [req.params.id]
  );
  res.json(rows);
};

export const addCat = async (req, res) => {
  const cat = {
    cat_name: req.body.name,
    weight: req.body.weight,
    owner: req.body.owner,
    filename: req.file?.filename || null,
    birthdate: req.body.birthdate,
  };

  const result = await addCatToDb(cat);
  result ? res.status(201).json(result) : res.sendStatus(400);
};

export const updateCat = async (req, res) => {
  const result = await modifyCat(req.body, req.params.id);
  result ? res.json(result) : res.sendStatus(400);
};

export const deleteCat = async (req, res) => {
  const result = await removeCat(req.params.id);
  result ? res.json(result) : res.sendStatus(400);
};
