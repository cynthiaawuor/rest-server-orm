export interface AuthContext {
  userId: string;
  role: UserRole;
}

export type UserRole = "admin" | "user";
