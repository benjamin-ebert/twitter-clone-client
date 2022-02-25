import { User } from "./user";
import { Image } from "./image";
import { Like } from "./like";

export interface Tweet {
  id: number;
  user: User;
  content: string;
  replies_to_id: number;
  replies_to: Tweet;
  replies: Tweet[];
  replies_count: number;
  auth_replied: boolean;
  retweets_id: number;
  retweets: Tweet[];
  retweets_count: number;
  likes: Like[];
  likes_count: number;
  auth_likes: boolean;
  images: Image[];
  created_at: string;
}
