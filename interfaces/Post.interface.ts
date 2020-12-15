import { Providers } from ".";

export interface Post {
  type: PostTypes;
  author: string | Author;
  body: PhotoPost | QuotePost;
  stars: string[];
  comments: string[] | Comment[];
  tags: string[];
  description?: string;
  provider: Providers;
  providerId?: string;
  createdAt: number;
}

export interface Author {
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
}

export interface Comment {
  author: string | Author;
  postId: string;
  message: string;
  replyTo: null | string;
}

export enum PostTypes {
  TEXT = "TEXT",
  PHOTO = "PHOTO",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  QUOTE = "QUOTE",
}

export interface PhotoPost {
  urls: string[];
}

export interface QuotePost {
  text: string;
  author: string;
}

export interface CountByTag {
  tag: string;
  count: number;
}
