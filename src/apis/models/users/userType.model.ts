import { Schema, model, Document, Types } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface IUserType extends Document {
  userTypeID: number;
  roleTitle: string;
  description: string;
  isArchive: boolean;
  createdAt: Date;
}

const userTypeSchema = new Schema<IUserType>({
  userTypeID: { type: Number, required: true, unique: true,  },
  roleTitle: { type: String, required: true },
  description: { type: String },
  isArchive: { type: Boolean, default: false,},
  createdAt: { type: Date, default: Date.now },
});

const UserType = model<IUserType>(CONSTANT.SCHEMA.USER_TYPE, userTypeSchema);
export default UserType
export {IUserType}

//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "USER_TYPE",
//   "data2": [{
//       "userTypeID": 1,
//       "roleTitle": "SYSTEM_ADMIN",
//       "description": ""
//   },
//   {
//       "userTypeID": 2,
//       "roleTitle": "ADMIN",
//       "description": ""
//   },
//   {
//       "userTypeID": 3,
//       "roleTitle": "CONTACT",
//       "description": ""
//   }]
// }