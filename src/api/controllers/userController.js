import {userItems} from '../models/userModel.js';

export const getUser = (req, res) => {
  res.json(userItems);
};

export const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = userItems.find((u) => u.user_id === id);

  user ? res.json(user) : res.sendStatus(404);
};

export const addUser = (req, res) => {
  const newUser = req.body;
  newUser.user_id = userItems.length + 1;

  userItems.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  res.json({message: 'User item updated.'});
};

export const deleteUser = (req, res) => {
  res.json({message: 'User item deleted.'});
};
