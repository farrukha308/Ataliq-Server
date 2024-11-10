import mongoose, { Schema, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface IAppConfig extends Document {
  NAME: string;
  VALUE: string | number | boolean; // Assuming VALUE can be of different types
  createdAt: Date;
  createdBy: string; // Assuming it's a user ID or a name
  isArchive: boolean;
}

const AppConfigSchema: Schema = new Schema<IAppConfig>({
  NAME: { type: String, required: true },
  VALUE: { type: Schema.Types.Mixed, required: true }, // Using Mixed type for flexibility
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String,  default: 'SCRIPT', required: true },
  isArchive: { type: Boolean, default: false },
});

// Exporting the model
const appConfigModel = mongoose.model<IAppConfig>(CONSTANT.SCHEMA.APP_CONFIG, AppConfigSchema);

export default appConfigModel

//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "APP_CONFIG",
//   "data2": [{
//       "NAME": "NO_ACCESS_TOKEN_ROUTES",
//       "VALUE": [
//         "loginEmail",
//         "loginGoogle",
//         "loginLinkedin",
//         "loginAppleid",
//         "signupEmail"
//       ],
//   }]
// }