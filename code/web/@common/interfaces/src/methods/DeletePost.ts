export namespace DeletePost {
  export interface Request {
    id: number;
  }

  export interface Response {
    deleted: boolean;
  }
}
