export namespace AddFriend {
    export interface Request {
        friend_username: string
    }

    export interface Response {
        data : {
            added: boolean;
        }
    }
}