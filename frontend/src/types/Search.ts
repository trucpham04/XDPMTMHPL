import { User } from "./User";

export interface SearchHistory {
  id: number;
  searchText: string;
  searcherId?: number;
  targetUser?: User;
  user?: User;
  createdAt?: string;
}
