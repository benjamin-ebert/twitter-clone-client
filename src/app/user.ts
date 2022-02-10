import { Tweet } from "./tweet";
import { Like } from "./like";

export interface User {
  id: number;
  name: string;
  handle: string;
  email: string;
  password: string;
  avatar: string;
  header: string;
  tweets: Tweet[];
  tweet_count: number;
  followers: User[];
  follower_count: number;
  followeds: User[];
  followed_count: number;
  likes: Like[];
  created_at: string;
}
