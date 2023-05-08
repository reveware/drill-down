import { Comment } from "..";

export namespace CreateComment {
  export interface Request {
    message: string;
    reply_to: number | null;
  }

  export interface Response {
    data: Comment;
  }
}
