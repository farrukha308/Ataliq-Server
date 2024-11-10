import mongoose, { Schema, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

export interface ISubject extends Document {
  name: string;
  description: string;
  lectureIds: mongoose.Types.ObjectId[];
  isArchive: boolean;
  createdAt: Date;
}

const SubjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  lectureIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: CONSTANT.SCHEMA.SUBJECT_LECTURE,  // Reference to the Lecture model
  }],
  isArchive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

const Subject = mongoose.model<ISubject>(CONSTANT.SCHEMA.COURSE_SUBJECT, SubjectSchema);
export default Subject;
