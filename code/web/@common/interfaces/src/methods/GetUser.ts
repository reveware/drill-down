import { UserDetail } from "..";

export namespace GetUser {
  export interface Request {
    username: string;
  }
  export interface Response {
    data: UserDetail;
  }
}
