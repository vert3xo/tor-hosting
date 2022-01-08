import { Author } from "./Author";

export type Post = {
  id?: number;
  title?: string;
  body?: string;
  authors?: Author[];
};
