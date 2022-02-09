import { User } from "./user";
import { Image } from "./image";
import { Like } from "./like";

export interface Tweet {
  id: number;
  user: User;
  content: string;
  replies_to_id: number;
  retweets_id: number;
  replies: Tweet[];
  retweets: Tweet[];
  likes: Like[];
  images: Image[];
  created_at: string;
}
