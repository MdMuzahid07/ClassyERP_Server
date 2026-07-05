import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../config";
import type { IUser, IUserMethods, UserModelType } from "./auth.interface";

const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    user.password = await bcrypt.hash(
      user.password as string,
      config.bcrypt_salt_rounds
    );
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (plainText: string) {
  return bcrypt.compare(plainText, this.password as string);
};

export const UserModel = model<IUser, UserModelType>("User", userSchema);
