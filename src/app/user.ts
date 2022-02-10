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
  follows: User[];
  likes: Like[];
  created_at: string;
}
