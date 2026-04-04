import bcrypt from 'bcrypt';
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
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const result = await addUserToDb(req.body);

    if (!result) {
      return res.sendStatus(400);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('addUser error', error);
    res.sendStatus(400);
  }
};

export const updateUser = async (req, res) => {
  const user = res.locals.user;
  const targetId = Number(req.params.id);

  if (user.user_id !== targetId && user.role !== 'admin') {
    return res.sendStatus(403);
  }

  const result = await modifyUser(req.body, targetId);
  result ? res.json(result) : res.sendStatus(400);
};

export const deleteUser = async (req, res) => {
  const user = res.locals.user;
  const targetId = Number(req.params.id);

  if (user.user_id !== targetId && user.role !== 'admin') {
    return res.sendStatus(403);
  }

  const result = await removeUser(targetId);
  result ? res.json(result) : res.sendStatus(400);
};
