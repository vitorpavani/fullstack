import { model, Schema, Document } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  lastName: string;
}

const User = model<IUser>('user', userSchema);
export default User;
