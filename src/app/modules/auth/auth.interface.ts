import type { Model } from "mongoose";

export type UserRole = "Admin" | "Manager" | "Employee";

export interface IUser {
  name?: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(plainText: string): Promise<boolean>;
}

export type UserModelType = Model<IUser, {}, IUserMethods>;
