export interface Post {
  type: PostTypes;
  author: string;
  body: PhotoPost | QuotePost;
  stars: string[];
  tags: string[];
  description?: string;
}

export enum PostTypes {
  TEXT = "TEXT",
  PHOTO = "PHOTO",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  QUOTE = "QUOTE",
}


export interface PhotoPost {
    urls: string[]
}

export interface QuotePost {
  text: string;
  author: string;
}

