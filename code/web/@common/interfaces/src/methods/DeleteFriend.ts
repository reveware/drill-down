export namespace DeleteFriend {
  export interface Request {
    username: string;
  }

  export interface Response {
    data: {
      deleted: boolean;
    };
  }
}
