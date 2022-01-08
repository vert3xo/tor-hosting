import { Post } from "./Post";

export type Author = {
  id?: number;
  name?: string;
  posts?: Post[];
};
