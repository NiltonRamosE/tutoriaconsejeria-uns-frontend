import type { User } from "@/domain/entities/User";

export interface LoginResponse {
  token: string;
  userResponse: User;
  userType: string;
}