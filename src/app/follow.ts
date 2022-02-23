import {User} from "./user";

export interface Follow {
  id: number;
  follower: User;
  followed: User;
  created_at: string;
  updated_at: string;
}
