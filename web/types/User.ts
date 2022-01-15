import type { Author } from "./Author";

export type User = {
  id?: number;
  admin?: boolean;
  username?: string;
  author?: Author;
};
