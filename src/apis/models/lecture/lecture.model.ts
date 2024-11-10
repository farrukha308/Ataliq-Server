import mongoose, { Schema } from "mongoose";
import CONSTANT from "../../../constant/constant";

export interface ILecture extends Document {
  title: string;
  description: string;
  videoLink: string;
  subjectId: mongoose.Types.ObjectId;
  isArchive: boolean,
  createdAt: Date
}

const LectureSchema: Schema = new Schema({
  title: {
      type: String,
      required: true,
  },
  description: {
      type: String,
  },
  videoLink: {
      type: String,
      required: true,
  },
  subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTANT.SCHEMA.COURSE_SUBJECT,  // Reference to the Subject model
      required: true,
  },
  isArchive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

const Lecture = mongoose.model<ILecture>(CONSTANT.SCHEMA.SUBJECT_LECTURE, LectureSchema);
export default Lecture;
