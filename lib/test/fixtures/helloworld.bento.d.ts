/**
 * GENERATED FILE. This file was generated by @kayteh/bento. Editing it is a bad idea.
 * @generated
 */
import Bento, { IBentoTransport } from '../..';
export declare type HelloRequest = {
    name?: string;
};
export declare type HelloReply = {
    message?: string;
};
export declare type SecurityOpts = {
    authed?: boolean;
};
export interface IHelloWorldService {
    sayHello(ctx: any, request: HelloRequest): Promise<HelloReply> | HelloReply;
}
export declare class HelloWorldClient {
    private bento;
    private transport?;
    static __SERVICE__: string;
    constructor(bento: Bento, transport?: IBentoTransport | undefined);
    sayHello(request: HelloRequest): Promise<HelloReply>;
}
export interface IBadServiceService {
    stuff(ctx: any, request: boolean): Promise<boolean> | boolean;
}
export declare class BadServiceClient {
    private bento;
    private transport?;
    static __SERVICE__: string;
    constructor(bento: Bento, transport?: IBentoTransport | undefined);
    stuff(request: boolean): Promise<boolean>;
}
