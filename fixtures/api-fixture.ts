//require('dotenv').config();
import * as mysql from 'mysql2/promise';
import { test as base } from '@playwright/test';
import { RequestHandlerAPIClient } from '../utils/request-handler';
import { IApiClient } from '../interfaces/IApiClient';
import { APILogger } from '../utils/logger';
import { config } from '../api-test.config';
import { createToken } from '../helpers/createToken';



// below we are creating two fixtures  i.e. 'api' and 'config'
// And now we can use api and config fixtures in our tests i.e. spec files
// api and config are test level fixtures, so they will be created for each test
// authToken will be worker level fixture, so it will be created once per worker
// so in one worker all tests will share same authToken value and token will be created only once per worker
// I have not created it as worker level fixture but if u want to create it as worker level fixture then
// follow bondar udemy academy course.

type TestOptions = {
    api: IApiClient;
    config: typeof config;
    db: mysql.Connection;
};

type WorkerFixture = {
    authToken: string
}


export const test = base.extend<TestOptions, WorkerFixture>({

    authToken: [async ({ }, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword);
        await use(authToken);
    }, { scope: 'worker' }],

    api: async ({ request, authToken }, use) => {
        const logger = new APILogger();
        const apiClient: IApiClient = new RequestHandlerAPIClient(request, logger);
        await use(apiClient);
    },
    config: async ({ }, use) => {
        await use(config);
    },
    db: async ({ }, use) => {
        let connection: mysql.Connection | undefined;

        try {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                connectTimeout: 5000
            });

            console.log('✅ DB connection established');

            await use(connection);

        } catch (error: any) {
            console.error('❌ DB CONNECTION FAILED');
            console.error('Host:', process.env.DB_HOST);
            console.error('User:', process.env.DB_USER);
            console.error('Database:', process.env.DB_NAME);
            console.error('Error:', error.message);

            throw new Error(
                `DB connection failed. Check DB_HOST / DB_USER / DB_PASSWORD / DB_NAME`
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log('🔌 DB connection closed');
            }
        }
    }
});

