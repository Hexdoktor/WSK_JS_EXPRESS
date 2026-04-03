import {
  listAllUsers,
  findUserById,
  addUser as addUserToDb,
  modifyUser,
  removeUser,
} from '../models/userModel.js';

export const getUsers = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  user ? res.json(user) : res.sendStatus(404);
};

export const addUser = async (req, res) => {
  const result = await addUserToDb(req.body);
  result ? res.status(201).json(result) : res.sendStatus(400);
};

export const updateUser = async (req, res) => {
  const result = await modifyUser(req.body, req.params.id);
  result ? res.json(result) : res.sendStatus(400);
};

export const deleteUser = async (req, res) => {
  const result = await removeUser(req.params.id);
  result ? res.json(result) : res.sendStatus(400);
};
