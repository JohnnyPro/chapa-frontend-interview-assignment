export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
