import mongoose, { Schema, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface IValidator extends Document {
  VALIDATOR_NAME: string;
  VALIDATOR_ROUTE_URL: string;
  VALIDATOR_FIELDES: string[] | null; // Assuming this is an array of strings, adjust type if necessary
  createdAt: Date;
  createdBy: string; // Assuming it's a user ID or a name, adjust type if necessary
  isArchive: boolean;
  API_VERSION: string; // Assuming it's a version string, adjust type if necessary
}

const ValidatorSchema: Schema = new Schema<IValidator>({
  VALIDATOR_NAME: { type: String, required: true, unique: true },
  VALIDATOR_ROUTE_URL: { type: String, required: true , unique: true},
  VALIDATOR_FIELDES: [{ type: String }], // Array of strings
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'SCRIPT', required: true },
  isArchive: { type: Boolean, default: false},
  API_VERSION: { type: String, default: 'v1', required: true },
});

// Exporting the model
const requestValidatorModel = mongoose.model<IValidator>(CONSTANT.SCHEMA.REQUEST_VALIDATOR, ValidatorSchema);
export default requestValidatorModel

//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "REQUEST_VALIDATOR",
//   "data2": [{
//       "VALIDATOR_NAME": "Signup Via Email",
//       "VALIDATOR_ROUTE_URL": "/api/v1/signupEmail",
//       "VALIDATOR_FIELDES": [
//           "email", 
//           "firstName", 
//           "lastName", 
//           "password",
//           "confirmPassword", 
//           "userTypeID"
//       ]
//   }]
// }


// {
//   "data1": "qwejdfklsf1",
//   "schema": "REQUEST_VALIDATOR",
//   "data2": [{
//       "VALIDATOR_NAME": "Forget Email",
//       "VALIDATOR_ROUTE_URL": "ForgetEmail",
//       "VALIDATOR_FIELDES": [
//           "firstName",
//           "lastName",
//           "dateOfBirth",
//           "requestTypes"
//       ]
//   }]
// }