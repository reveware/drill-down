import { PostDetail } from "src/types";

export namespace GetPostDetail {
  export interface Request {
    id: number;
  }
  export interface Response {
    data: PostDetail;
  }
}
