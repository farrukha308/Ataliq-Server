import mongoose, { Schema, Document, Types } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface IResourcePermission extends Document {
  RESOURCE_NAME: string;
  VALUE: any; // Assuming VALUE can be of different types
  ROLE_ID: Types.ObjectId; // Reference to the roles model
  ATTIBUTE1: any; // Reference to the roles model
  ATTIBUTE2: any; // Reference to the roles model
  ATTIBUTE3: any; // Reference to the roles model
  createdAt: Date;
  createdBy: string; // Assuming it's a user ID or a name
  isArchive: boolean;
}

const ResourcePermissionSchema: Schema = new Schema<IResourcePermission>({
  RESOURCE_NAME: { type: String, required: true, unique: true },
  VALUE: { type: Schema.Types.Mixed, required: true }, // Mixed type for flexibility
  ROLE_ID: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.APP_ROLES, required: true },
  ATTIBUTE1: { type: Schema.Types.Mixed }, // Reference to the roles model
  ATTIBUTE2: { type: Schema.Types.Mixed }, // Reference to the roles model
  ATTIBUTE3: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: "SCRIPT", required: true },
  isArchive: { type: Boolean, default: false },
});

// Exporting the model
const resourcePermissionModel = mongoose.model<IResourcePermission>(CONSTANT.SCHEMA.RESOURCE_PERMISSIONS, ResourcePermissionSchema);
export default resourcePermissionModel
export {IResourcePermission}


//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "RESOURCE_PERMISSIONS",
//   "data2": [
//     {
//       "RESOURCE_NAME": "Home Tab",
//       "VALUE": "TAB_HOME",
//       "ROLE_ID": 7,
//       "ATTIBUTE1": "",
//       "ATTIBUTE2": "",
//       "ATTIBUTE3": ""
//     },
//     {
//       "RESOURCE_NAME": "Chat Tab",
//       "VALUE": "TAB_CHAT",
//       "ROLE_ID": 7,
//       "ATTIBUTE1": "",
//       "ATTIBUTE2": "",
//       "ATTIBUTE3": ""
//     },
//   ]
// }