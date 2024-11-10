import mongoose, { Schema, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

export interface IAppRoles extends Document {
  ROLE_NAME: string;
  ROLE_ID: number; // Assuming this is a unique identifier for the role
  createdAt: Date;
  createdBy: string; // Assuming it's a user ID or a name
  isArchive: boolean;}

const appRoleSchema: Schema = new Schema<IAppRoles>({
  ROLE_NAME: { type: String, required: true, unique: true },
  ROLE_ID: { type: Number, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String,  default: 'SCRIPT', required: true },
  isArchive: { type: Boolean, default: false },
});

// Exporting the model
const rolesModel = mongoose.model<IAppRoles>(CONSTANT.SCHEMA.APP_ROLES, appRoleSchema);
export default rolesModel

//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "APP_ROLES",
//   "data2": [
//   {
//       "ROLE_NAME": "STAFF",
//       "ROLE_ID": 1
//   },
//   {
//       "ROLE_NAME": "GUEST_PARENT",
//       "ROLE_ID": 2
//   },
//   {
//       "ROLE_NAME": "GUEST_PLAYER",
//       "ROLE_ID": 5
//   }]
// }
