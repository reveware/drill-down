import { UserOverview } from "./user";

// I ain't seen the grown in days, since I grew propellers

export type PostOverview = {
  id: number;
  author: UserOverview;
  description: string | null;
  like_count: number;
  comment_count: number;
  tags: string[];
  created_at: Date;
  updated_at: Date;
} & PostContent;

export type PostDetail = PostOverview & {
  likes: UserOverview[];
  comments: Comment[];
  tag_count: CountPerTag;
};

export enum PostTypes {
  PHOTO = "PHOTO",
  QUOTE = "QUOTE",
}

export type PostContent =
  | { type: PostTypes.PHOTO; content: PhotoPostContent }
  | { type: PostTypes.QUOTE; content: QuotePostContent };

export interface PhotoPostContent {
  urls: string[];

  
}

export interface QuotePostContent {
  quote: string;
  author: string;
  date?: Date
  location? : string // contry
}

export interface Comment {
  id: number;
  author: UserOverview;
  post_id: number;
  message: string;
  reply_to: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface TimeBomb {
  id: number;
  author: UserOverview;
  recipient: UserOverview;
  content: object;
  visible_at: Date;
  created_at: Date;
  updated_at: Date;
}

export type CountPerTag = {
  [tag: string]: number;
};
