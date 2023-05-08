export namespace DeleteFriend {
  export interface Request {
    friend_username: string;
  }

  export interface Response {
    data: {
      deleted: boolean;
    };
  }
}
