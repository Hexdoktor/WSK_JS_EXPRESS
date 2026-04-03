import promisePool from '../../utils/database.js';

export const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  return rows;
};

export const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );
  return rows.length ? rows[0] : false;
};

export const addUser = async (user) => {
  const {name, username, email, password, role = 'user'} = user;

  const sql = `
    INSERT INTO wsk_users (name, username, email, password, role)
    VALUES (?, ?, ?, ?, ?)`;

  const params = [name, username, email, password, role];

  const [result] = await promisePool.execute(sql, params);

  return result.affectedRows ? {user_id: result.insertId} : false;
};

export const modifyUser = async (user, id) => {
  const sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [
    user,
    id,
  ]);

  const [result] = await promisePool.execute(sql);
  return result.affectedRows ? {message: 'success'} : false;
};

export const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);

    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    return {message: 'success'};
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
