import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import type { IUser, IUserMethods, UserModelType } from './auth.interface';

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
      enum: ['Admin', 'Manager', 'Employee'],
      default: 'Employee',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    this.password = await bcrypt.hash(this.password, config.bcrypt_salt_rounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password methods
userSchema.methods.comparePassword = async function (plainText: string) {
  return bcrypt.compare(plainText, this.password ?? '');
};

userSchema.methods.isPasswordMatched = async function (plainText: string) {
  return bcrypt.compare(plainText, this.password ?? '');
};

export const UserModel = model<IUser, UserModelType>('User', userSchema);
