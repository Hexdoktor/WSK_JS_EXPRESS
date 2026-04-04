import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  console.log('authenticateToken headers', req.headers);

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('token', token);

  //if no token provided, unauthorized
  if (token === null) {
    return res.sendStatus(401);
  }

  try {
    //verify token and decode using secret
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    //store decoded user in res.locals so controllers can access it
    res.locals.user = decodedUser;

    next();
  } catch (error) {
    console.error('JWT verify error', error);
    //token invalid or expired -> forbidden
    res.status(403).send({message: 'invalid token'});
  }
};
