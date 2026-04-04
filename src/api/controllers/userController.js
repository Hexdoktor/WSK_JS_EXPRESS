import bcrypt from 'bcrypt';
import {
  listAllUsers,
  findUserById,
  addUser as addUserToDb,
  modifyUser,
  removeUser,
} from '../models/userModel.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res, next) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const result = await addUserToDb(req.body);

    if (!result) {
      const error = new Error('Failed to create user');
      error.status = 400;
      return next(error);
    }

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const targetId = Number(req.params.id);

    if (user.user_id !== targetId && user.role !== 'admin') {
      const error = new Error('Forbidden');
      error.status = 403;
      return next(error);
    }

    const result = await modifyUser(req.body, targetId);

    if (!result) {
      const error = new Error('User not found or update failed');
      error.status = 400;
      return next(error);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const targetId = Number(req.params.id);

    if (user.user_id !== targetId && user.role !== 'admin') {
      const error = new Error('Forbidden');
      error.status = 403;
      return next(error);
    }

    const result = await removeUser(targetId);

    if (!result) {
      const error = new Error('User not found or delete failed');
      error.status = 400;
      return next(error);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};
