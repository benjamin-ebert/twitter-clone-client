import { Tweet } from "./tweet";

export interface Like {
  id: number;
  tweet_id: number;
  tweet: Tweet
}
