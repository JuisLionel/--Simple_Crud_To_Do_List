import { query } from "../db.js";

export const getData = async (req, res) => {
   const { rows } = await query('SELECT * FROM client_tb');
   return rows;
};

export const addData = async (data) => {
   const { task, finish } = data;
   const { rows } = await query(
      'INSERT INTO client_tb (task, finish) VALUES ($1, $2) RETURNING *',
      [task, finish]
   );

   return rows[0];
};

export const updateData = async (id, data) => { ;
   const { task, finish } = data;
   const { rows } = await query(
      'UPDATE client_tb SET task = $1, finish = $2 WHERE index = $3 RETURNING *',
      [task, finish, id]
   );

   return rows[0];
};

export const deleteData = async (id) => {
    // Delete the row
    await query(`DELETE FROM client_tb WHERE index = $1`, [id]);

    // Reorder the indexes to be sequential
    await query(`
        WITH reordered AS (
            SELECT index, ROW_NUMBER() OVER (ORDER BY index) AS new_index
            FROM client_tb
        )
        UPDATE client_tb
        SET index = reordered.new_index
        FROM reordered
        WHERE client_tb.index = reordered.index
    `);

    await query(`ALTER SEQUENCE client_tb_index_seq RESTART WITH 1`);
    await query(`SELECT setval('client_tb_index_seq', COALESCE(MAX(index), 0) + 1, false) FROM client_tb`);

    return true;
};



