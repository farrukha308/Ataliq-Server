import { Schema, model, Document, Types } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface IUser extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  status: string;
  isArchive: boolean;
  createdAt: Date;
  appRole: Types.ObjectId;
  adminId?: Types.ObjectId;
  googleId?: string;
  appleId?: string;
  linkedinId?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  appleAccessToken?: string;
  appleRefreshToken?: string;
  linkedinAccessToken?: string;
  linkedinRefreshToken?: string;
  emailVerified: boolean;
  mobilePhone: string; // New field
  dateOfBirth: string; // New field
  board: string;
  city: string;
  class: string;
}

interface userDataType {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  appleAccessToken?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String, required: true },
  status: { type: String, required: true, default: CONSTANT.USER_STATUS.REGISTER },
  isArchive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  appRole: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.APP_ROLES, required: true },
  adminId: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.USER },
  googleId: { type: String, unique: true, sparse: true },
  appleId: { type: String, unique: true, sparse: true },
  linkedinId: { type: String, unique: true, sparse: true },
  googleAccessToken: { type: String },
  googleRefreshToken: { type: String },
  appleAccessToken: { type: String },
  appleRefreshToken: { type: String },
  linkedinAccessToken: { type: String },
  linkedinRefreshToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  mobilePhone: { type: String }, // New field
  dateOfBirth: { type: String }, // New field
  board: { type: String }, // New field
  city: { type: String }, // New field
  class: { type: String } // New field
});

const User = model<IUser>(CONSTANT.SCHEMA.USER, userSchema);
export default User;
export { IUser, userDataType };
