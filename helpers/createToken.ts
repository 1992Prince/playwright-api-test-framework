import { request } from '@playwright/test';
import { APILogger } from '../utils/logger';
import { RequestHandlerAPIClient } from '../utils/request-handler';
import { config } from '../api-test.config';



export async function createToken(email: string, password: string) {

    const context = await request.newContext();
    const logger = new APILogger();
    const api = new RequestHandlerAPIClient(context, logger);

    try {
        const tokenResponse = await api
        .url(config.apiUrl)
            .path('/users/login')
            .body({
                "user": {
                    "email": email,
                    "password": password
                }
            })
            .postRequest();


        const tokenResponseBody = await tokenResponse.json();
        return 'Token ' + tokenResponseBody.user.token;
    } catch (error: any) {
        Error.captureStackTrace(error, createToken);
        throw error;
    } finally {
        await context.dispose();
    }

}