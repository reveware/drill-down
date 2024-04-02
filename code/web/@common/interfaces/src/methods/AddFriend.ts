export namespace AddFriend {
    export interface Request {
        username: string
    }

    export interface Response {
        data : {
            added: boolean;
        }
    }
}