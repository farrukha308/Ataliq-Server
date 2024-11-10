import mongoose, { Schema, Document, Types } from 'mongoose';
import CONSTANT from '../../../constant/constant';
import { IResourcePermission } from '../configs/resourcePermission.model';


interface IUserSession extends Document {
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    userPermission: Array<IResourcePermission>;
    isArchive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const sessionSchema: Schema = new Schema<IUserSession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userPermission: { type: [Schema.Types.Mixed], required: true }, // Define userPermission as an array of userPermissionSchema
    isArchive: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

const userSession = mongoose.model<IUserSession>(CONSTANT.SCHEMA.USER_SESSION, sessionSchema);
export default userSession;
export {IUserSession}