// src/clients/RequestHandlerAPIClient.ts
import { APIRequestContext, APIResponse } from "@playwright/test";
import { IApiClient } from "../interfaces/IApiClient";
import { ApiError } from "../errors/ApiError";
import { APILogger } from "./logger";
import { test } from "@playwright/test"

export class RequestHandlerAPIClient implements IApiClient {
    private logger: APILogger;
    private request: APIRequestContext;
    private baseUrl: string | undefined;
    private defaultBaseUrl: string | undefined;
    private apiPath: string = "";
    private queryParams: Record<string, any> = {};
    private requestHeaders: Record<string, string> = {};
    private requestBody: object = {};
    //private authToken: string = '';
    //private clearAuthFlag: boolean = false;



    constructor(request: APIRequestContext, logger: APILogger, authToken: string = '') {
        this.request = request;
        this.logger = logger;
        //this.authToken = authToken;
    }

    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    path(path: string) {
        this.apiPath = path;
        return this;
    }

    params(params: object) {
        this.queryParams = params as Record<string, any>;
        return this;
    }

    headers(headers: Record<string, string>) {
        this.requestHeaders = headers;
        return this;
    }

    body(body: object) {
        this.requestBody = body;
        return this;
    }

    // clearAuth(){
    //     this.clearAuthFlag = true;
    //     return this;
    // }

    // private getHeaders(){
    //     if(!this.clearAuthFlag){
    //         this.requestHeaders['Authorization'] = this.authToken;
    //     }
    //     return this.requestHeaders;
    // }



    // --- Add these helper methods inside the class (paste before getRequest) ---

    private async parseResponse(response: APIResponse): Promise<any> {
        try {
            return await response.json();
        } catch {
            try {
                return await response.text();
            } catch {
                return '[unreadable body]';
            }
        }
    }



    private resetRequestState() {
        this.apiPath = '';
        this.queryParams = {};
        this.requestHeaders = {};
        this.requestBody = {};
        //this.clearAuthFlag = false;
        // keep baseUrl/defaultBaseUrl untouched
    }

    /**
     * Centralized request sender
     */
    private async send(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): Promise<APIResponse> {
        const url = this.getUrl();
        let response: APIResponse | undefined;

        await test.step(`${method} request to: ${url}`, async () => {
            // log request once
            this.logger.logRequest(method, url, this.requestHeaders, this.requestBody);

            try {
                // choose Playwright call based on method
                switch (method) {
                    case 'GET':
                        response = await this.request.get(url, { headers: this.requestHeaders });
                        break;
                    case 'POST':
                        response = await this.request.post(url, { headers: this.requestHeaders, data: this.requestBody });
                        break;
                    case 'PUT':
                        response = await this.request.put(url, { headers: this.requestHeaders, data: this.requestBody });
                        break;
                    case 'DELETE':
                        response = await this.request.delete(url, { headers: this.requestHeaders });
                        break;
                }

                // defensive: ensure we actually got a response before parsing
                if (!response) {
                    throw new ApiError('No response received from request (inside test.step).');
                }

                // parse and log
                const parsed = await this.parseResponse(response);
                this.logger.logResponse(response.status(), parsed);

                // throw if not ok
                if (!response.ok()) {
                    const logs = this.logger.getRecentLogs();
                    throw new ApiError(`Request failed with status ${response.status()}\n\nLogs:\n${logs}`);
                }

                // NOTE: DO NOT `return` here — we will return after test.step
            } catch (err: any) {
                if (err instanceof ApiError) {
                    throw err;
                }
                throw new ApiError(`Unexpected error: ${err?.message || err}`);
            } finally {
                // keep client clean for next call
                this.resetRequestState();
            }
        });

        // After the step completes, return or throw so outer function satisfies its signature
        if (!response) {
            throw new ApiError('No response received from request (after test.step).');
        }
        return response;
    }


    async getRequest(): Promise<APIResponse> {
        return this.send('GET');
    }

    async postRequest(): Promise<APIResponse> {
        return this.send('POST');
    }

    async putRequest(): Promise<APIResponse> {
        return this.send('PUT');
    }

    async deleteRequest(): Promise<APIResponse> {
        return this.send('DELETE');
    }


    private getUrl(): string {
        const base = this.baseUrl ?? this.defaultBaseUrl;
        if (!base) {
            throw new ApiError(
                "Base URL not configured. Please call `.url(...)` or provide apiBaseUrl in constructor.",
                undefined,
                { baseUrlProvided: false }
            );
        }

        let urlObj: URL;
        try {
            urlObj = new URL(`${base}${this.apiPath}`);
        } catch (err) {
            throw new ApiError("Invalid URL constructed", undefined, {
                base,
                apiPath: this.apiPath,
                originalError: (err as Error).message,
            });
        }

        for (const [key, value] of Object.entries(this.queryParams ?? {})) {
            if (value === undefined || value === null) continue; // Skip undefined/null params
            urlObj.searchParams.append(key, String(value));
        }

        return urlObj.toString();
    }

    public getLogs(): string {
        return this.logger.getRecentLogs();
    }

    public clearLogs(): void {
        this.logger.clearLogs();
    }

}
