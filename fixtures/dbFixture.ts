import { test as base } from '@playwright/test';
import * as mysql from 'mysql2/promise';

type DbFixtures = {
  db: mysql.Connection;
};

export const test = base.extend<DbFixtures>({
  db: async ({}, use) => {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root123',
      database: process.env.DB_NAME || 'testdb'
    });

    await use(connection);

    await connection.end();
  }
});

export { expect } from '@playwright/test';
