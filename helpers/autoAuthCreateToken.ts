import { request } from '@playwright/test';
import { APILogger } from '../utils/logger';
import { RequestHandlerAPIClient } from '../utils/request-handler';
import { config } from '../api-test.config';



export async function autoAuthCreateToken() {

    const context = await request.newContext();
    const logger = new APILogger();
    const api = new RequestHandlerAPIClient(context, logger);

    try {
        const tokenResponse = await api
            .url(config.authTokenBaseUrl)
            .path('/')
            .body({
                "client_id": "LjJM2IJnaYIXqkNEVURLr4Lldu2thoIP",
                "client_secret": "iObYF0cqiC9vvcFK4Nv1iuYLQ3VJM7srTu4bsaabyb1n1NyHiH_jw2IAHDvEMT9Y",
                "audience": "test",
                "username": "princepandey155@gmail.com",
                "password": "@BestPanday1!",
                "grant_type": "password"
            })
            .postRequest();


        const tokenResponseBody = await tokenResponse.json();
        return tokenResponseBody.access_token;
    } catch (error: any) {
        Error.captureStackTrace(error, autoAuthCreateToken);
        throw error;
    } finally {
        await context.dispose();
    }

}