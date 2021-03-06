/**
 * GENERATED FILE. This file was generated by @kayteh/bento. Editing it is a bad idea.
 * @generated
 */
import Bento, { IBentoTransport } from '../..';
export declare type Ok = {
    ok?: boolean;
};
export declare type None = {};
export declare type PostQuery = {
    id: string;
};
export declare type Post = {
    id?: string;
    content: string;
};
export interface ICrudTestService {
    createPost(ctx: any, request: Post): Promise<Post> | Post;
    listPosts(ctx: any, request: None): Promise<Post> | Post;
    getPost(ctx: any, request: PostQuery): Promise<Post> | Post;
    updatePost(ctx: any, request: Post): Promise<Post> | Post;
    deletePost(ctx: any, request: PostQuery): Promise<Ok> | Ok;
}
export declare class CrudTestClient {
    private bento;
    private transport?;
    static __SERVICE__: string;
    constructor(bento: Bento, transport?: IBentoTransport | undefined);
    createPost(request: Post): Promise<Post>;
    listPosts(request: None): Promise<Post>;
    getPost(request: PostQuery): Promise<Post>;
    updatePost(request: Post): Promise<Post>;
    deletePost(request: PostQuery): Promise<Ok>;
}
