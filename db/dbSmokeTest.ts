import * as mysql from 'mysql2/promise';

export async function fetchUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root123',
    database: 'testdb'
  });

  const [rows] = await connection.execute(
    'SELECT user_id, status FROM user_account'
  );

  await connection.end();
  return rows;
}
