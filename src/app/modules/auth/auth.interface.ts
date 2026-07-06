import type { Model } from 'mongoose';

export const USER_ROLE = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface IUser {
  name?: string;
  email: string;
  password?: string;
  role: TUserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TJwtPayload {
  id: string;
  email: string;
  role: TUserRole;
}

export interface IUserMethods {
  comparePassword(plainText: string): Promise<boolean>;
  isPasswordMatched(plainText: string): Promise<boolean>;
}

export type UserModelType = Model<IUser, Record<string, never>, IUserMethods>;
