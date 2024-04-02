import { PostOverview } from "..";
interface BasePost {
  tags: string[],
  description?: string;
}

export namespace CreatePhotoPost{
  export interface Request extends BasePost{
    photos: File[];
  }

  export interface Response {
    data: PostOverview;
  }
}

export namespace CreateQuotePost {
  export interface Request extends BasePost {
    quote: string;
    author: string;
    date?: Date;
    location?: string; // contry
  }
  export interface Response {
    data: PostOverview
  }
}
