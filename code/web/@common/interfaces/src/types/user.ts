import { PostOverview, TimeBomb, CountPerTag} from "./post";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserOverview {
  id: number;
  username: string;
  email: string;
  avatar: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  tagline: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface UserDetail extends UserOverview {
  posts: PostOverview[];
  likes: PostOverview[];
  friends: UserOverview[];
  pending_friends?: UserOverview[]; // only if self
  created_time_bombs: TimeBomb[];
  received_time_bombs: TimeBomb[];
  posts_per_tag: CountPerTag;
}
