import { PostOverview } from "..";

export namespace CreatePhotoPost {
  export interface Request {
    photos: string[];
    tags: string[];
    description?: string;
  }

  export interface Response {
    data: PostOverview;
  }
}
