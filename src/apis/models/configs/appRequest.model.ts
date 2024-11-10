import { Schema, model, Document, Types } from 'mongoose';
import CONSTANT from '../../../constant/constant';

// Define the interface for the request
export interface IRequest extends Document {
  requestType: string;     // Type of request (e.g., 'activate_user', 'change_role')
  requestBy: Types.ObjectId; // The user/admin who made the request (reference to User model)
  targetUser?: Types.ObjectId; // The user related to the request (optional, reference to User model)
  status: string;           // Status of the request ('pending', 'approved', 'rejected')
  reason?: string;          // Reason for the request (optional, if provided)
  actionDetails?: object;   // Additional details or payload for the request
  reviewedBy?: Types.ObjectId; // The admin who reviewed the request (reference to User model)
  createdAt: Date;          // Timestamp when the request was created
  updatedAt: Date;          // Timestamp when the request was last updated
  reviewedAt?: Date;        // Timestamp when the request was reviewed
}

// Define the schema for the request
const RequestSchema = new Schema<IRequest>({
  requestType: { type: String, required: true }, // Type of request (e.g., 'activate_user', 'change_role')
  requestBy: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.USER, required: true }, // Reference to the user or admin who made the request
  targetUser: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.USER }, // (Optional) The user this request is about (e.g., activating a user)
  status: {
    type: String,
    enum: [CONSTANT.PENDING, CONSTANT.REJECT, CONSTANT.APPROVED],  // Request status
    default: CONSTANT.PENDING,
    required: true
  },
  reason: { type: String }, // Optional reason for the request
  actionDetails: { type: Object }, // Optional payload with extra details
  reviewedBy: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.USER }, // (Optional) The admin who approved/rejected the request
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
  updatedAt: { type: Date, default: Date.now }, // Last update timestamp
  reviewedAt: { type: Date }, // Timestamp for when the request was reviewed (optional)
});

// Middleware to update `updatedAt` on modification
RequestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the model from the schema
const appRequest = model<IRequest>(CONSTANT.SCHEMA.APP_REQUEST, RequestSchema);

export default appRequest;
