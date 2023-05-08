import { PostOverview } from "..";

export namespace CreatePhotoPost {
  export interface Request {
    photos: File[];
    tags: string[];
    description?: string;
  }

  export interface Response {
    data: PostOverview;
  }
}
