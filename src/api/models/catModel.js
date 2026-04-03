import promisePool from '../../utils/database.js';

export const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT c.*, u.name AS owner_name
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
    `);
  return rows;
};

export const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `
    SELECT c.*,  u.name AS owner_name
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.cat_id = ?
    `,
    [id]
  );

  return rows.length ? rows[0] : false;
};

export const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;

  const sql = `
  INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
  VALUES  (?, ?, ?, ?, ?)
  `;

  const params = [cat_name, weight, owner, filename, birthdate];
  const [result] = await promisePool.execute(sql, params);

  return result.affectedRows ? {cat_id: result.insertId} : false;
};

export const modifyCat = async (cat, id) => {
  const sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
    cat,
    id,
  ]);

  const [result] = await promisePool.execute(sql);
  return result.affectedRows ? {message: 'success'} : false;
};

export const removeCat = async (id) => {
  const [result] = await promisePool.execute(
    `DELETE FROM wsk_cats WHERE cat_id = ?`,
    [id]
  );

  return result.affectedRows ? {message: 'success'} : false;
};
