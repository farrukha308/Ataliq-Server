import mongoose, { Schema, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

// OTP Interface
export interface IOTP extends Document {
  email: string;
  otpCode: string;
  expiresAt: Date;
  verified?: boolean;
  createdAt?: Date;
}

// OTP Schema
const OTPSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index to automatically delete expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model<IOTP>(CONSTANT.SCHEMA.OTP, OTPSchema);

export default OTP;
