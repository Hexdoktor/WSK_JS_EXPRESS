import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {findUserByUsername} from '../models/userModel.js';

export const postLogin = async (req, res) => {
  try {
    console.log('postLogin body', req.body);

    const {username, password} = req.body;

    const user = await findUserByUsername(username);

    if (!user) {
      return res.sendStatus(400);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.sendStatus(401);
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
    console.log('postLogin error', error);
    res.sendStatus(500);
  }
};

export const getMe = async (req, res) => {
  console.log('getMe user from res.locals', res.locals.user);

  if (res.locals.user) {
    return res.json({message: 'token ok', user: res.locals.user});
  }

  res.sendStatus(401);
};
