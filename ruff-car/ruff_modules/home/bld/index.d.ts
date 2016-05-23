import 'promise';
import * as HTTP from 'http';
import { IncomingMessage, ServerResponse } from 'http';
export declare type HTTPMethod = 'GET' | 'POST';
export interface Dictionary<T> {
    [key: string]: T;
}
export declare type Resolvable<T> = Promise<T> | T;
export interface Request extends IncomingMessage {
    path: string;
    query: Dictionary<string>;
}
export interface Middleware {
    (req: Request, res: ServerResponse): Resolvable<Response | Object | void>;
}
export interface RouteOptions {
    method: string;
    path: string;
    extend: boolean;
    middleware: Middleware;
}
export interface Route extends RouteOptions {
    pathWithEndingSlash: string;
}
export declare abstract class Response {
    abstract applyTo(req: ServerResponse): void;
}
export declare class ExpectedError {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare class NotFoundError extends ExpectedError {
    path: string;
    constructor(message: string, path: string);
}
export declare class Server {
    server: HTTP.Server;
    routes: Route[];
    views: string;
    errorViewsFolder: string;
    private _templateCache;
    constructor({views, errorViewsFolder}?: {
        views?: string;
        errorViewsFolder?: string;
    });
    private _handleRequest(req, res);
    add(options: RouteOptions): void;
    use(path: string, middleware: Middleware): void;
    get(path: string, middleware: Middleware): void;
    post(path: string, middleware: Middleware): void;
    listen(port: number, hostname?: string): Promise<void>;
    private _handleResult(req, res, result);
    private _handleError(req, res, error);
    private _render(view, data);
    static static(path: string, defaultPath?: string): Middleware;
}
export default Server;
