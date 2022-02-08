import { Tweet} from "./tweet";

export interface User {
  id: number;
  name: string;
  handle: string;
  email: string;
  password: string;
  avatar: string;
  header: string;
  tweets: Tweet[];
  followers: User[];
  follows: User[];
  created_at: string;
}
