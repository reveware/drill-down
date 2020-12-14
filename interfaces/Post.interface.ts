import { Providers } from ".";

export interface Post {
  type: PostTypes;
  author: string | { // After using mongoose populate, otherwise just ID
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
  };
  body: PhotoPost | QuotePost;
  stars: string[];
  tags: string[];
  description?: string;
  provider: Providers;
  providerId?: string;
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
