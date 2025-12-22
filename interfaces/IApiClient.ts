import { APIResponse } from "@playwright/test";

// small building blocks
export interface IRequestBuilder {
  url(url: string): this;
  path(path: string): this;
  params(params: object): this;
  headers(headers: Record<string, string>): this;
  body(body: object): this;
}

export interface IExecutor {
  getRequest(): Promise<APIResponse>;
  postRequest(): Promise<APIResponse>;
  putRequest(): Promise<APIResponse>;
  deleteRequest(): Promise<APIResponse>;
  //clearAuth(): any;
}

export interface ILoggable {
  getLogs(): string;
  clearLogs(): void;
}

// Compose the final interface (tests can depend on the composed type)
export type IApiClient = IRequestBuilder & IExecutor & ILoggable;


// export interface IApiClient {
//   url(url: string): this;
//   path(path: string): this;
//   params(params: object): this;
//   headers(headers: Record<string, string>): this;
//   body(body: object): this;

//   getRequest(): Promise<APIResponse>;
//   postRequest(): Promise<APIResponse>;
//   putRequest(): Promise<APIResponse>;
//   deleteRequest(): Promise<APIResponse>;
//   getLogs(): string;
//   clearLogs(): void;
// }

//👉 This interface defines the contract that any API client must follow.