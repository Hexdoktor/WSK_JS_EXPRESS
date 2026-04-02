import {catItems} from '../models/catModel.js';

export const getCats = (req, res) => {
  res.json(catItems);
};

export const getCatById = (req, res) => {
  const id = Number(req.params.id);
  const cat = catItems.find((c) => c.cat_id === id);

  cat ? res.json(cat) : res.sendStatus(404);
};

export const addCat = (req, res) => {
  const newCat = req.body;
  newCat.cat_id = catItems.length + 1;

  catItems.push(newCat);
  res.status(201).json(newCat);
};

export const updateCat = (req, res) => {
  res.json({message: 'Cat item updated.'});
};

export const deleteCat = (req, res) => {
  res.json({message: 'Cat item deleted.'});
};
