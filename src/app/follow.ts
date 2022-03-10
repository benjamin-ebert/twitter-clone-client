import {User} from "./user";

export interface Follow {
  id: number;
  follower_id: number;
  follower: User;
  followed_id: number;
  followed: User;
  created_at: string;
  updated_at: string;
}
