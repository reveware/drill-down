import { MaybePopulated, Provider } from ".";

export interface Post {
  type: PostTypes;
  author: MaybePopulated<string, Author>;
  body: PhotoPost | QuotePost;
  likes: MaybePopulated<string[], Author[]>;
  comments: MaybePopulated<string[], Comment[]>;
  tags: string[];
  description?: string;
  provider: Provider;
  createdAt: number;
}

export interface Author {
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
}

export interface Comment {
  author: MaybePopulated<string, Author>;
  postId: string;
  message: string;
  replyTo: null | string;
  createdAt: number;
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
