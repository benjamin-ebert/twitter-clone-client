import { Tweet } from "./tweet";
import { Like } from "./like";
import { Follow } from "./follow";

export interface User {
  id: number;
  email: string;
  name: string;
  handle: string;
  bio: string;
  password: string;
  avatar: string;
  header: string;
  tweets: Tweet[];
  tweet_count: number;
  auth_follow: Follow | null;
  followers: User[];
  follower_count: number;
  followeds: User[];
  followed_count: number;
  likes: Like[];
  created_at: string;
}
