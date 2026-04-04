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

export const modifyCatByOwner = async (cat, catId, ownerId) => {
  const sql = `
    UPDATE wsk_cats
    SET ?
    WHERE cat_id = ? AND owner = ?
  `;
  const formatted = promisePool.format(sql, [cat, catId, ownerId]);
  const [result] = await promisePool.execute(formatted);
  return result.affectedRows ? {message: 'success'} : false;
};

export const modifyCatAdmin = async (cat, catId) => {
  const sql = `
    UPDATE wsk_cats
    SET ?
    WHERE cat_id = ?
  `;
  const formatted = promisePool.format(sql, [cat, catId]);
  const [result] = await promisePool.execute(formatted);
  return result.affectedRows ? {message: 'success'} : false;
};

export const removeCatByOwner = async (catId, ownerId) => {
  const sql = `
    DELETE FROM wsk_cats
    WHERE cat_id = ? AND owner = ?
  `;
  const [result] = await promisePool.execute(sql, [catId, ownerId]);
  return result.affectedRows ? {message: 'success'} : false;
};

export const removeCatAdmin = async (catId) => {
  const sql = `
    DELETE FROM wsk_cats
    WHERE cat_id = ?
  `;
  const [result] = await promisePool.execute(sql, [catId]);
  return result.affectedRows ? {message: 'success'} : false;
};

export const removeCat = async (id) => {
  const [result] = await promisePool.execute(
    `DELETE FROM wsk_cats WHERE cat_id = ?`,
    [id]
  );

  return result.affectedRows ? {message: 'success'} : false;
};
