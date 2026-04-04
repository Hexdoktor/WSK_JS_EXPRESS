import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {findUserByUsername} from '../models/userModel.js';

export const postLogin = async (req, res, next) => {
  try {
    console.log('postLogin body', req.body);

    const {username, password} = req.body;

    const user = await findUserByUsername(username);

    if (!user) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      return next(error);
    }

    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({user: userWithNoPassword, token});
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    console.log('getMe user from res.locals', res.locals.user);

    if (!res.locals.user) {
      const error = new Error('Unauthorized');
      error.status = 401;
      return next(error);
    }

    res.json({message: 'token ok', user: res.locals.user});
  } catch (err) {
    next(err);
  }
};
