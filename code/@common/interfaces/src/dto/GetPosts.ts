import { PostOverview } from "src/types";

export namespace GetPosts {
  export interface Request {
    id?: number;
    tags?: string;
    author?: string;
    page_number: number;
    page_size: number;
  }

  export interface Response {
    data: PostOverview[];
    page: number;
    total: number;
  }
}
