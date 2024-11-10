import { Schema, model, Document, Types } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface ICourse extends Document {
  name: string;
  // gradeId: Types.ObjectId;
  grade: string;
  subjectIds?: Types.ObjectId[];
  isArchive: boolean;
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  // gradeId: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.STUDENT_GRADE, required: true },
  grade: {type: String, required: true},
  subjectIds: [{ type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.COURSE_SUBJECT }],
  isArchive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Course = model<ICourse>(CONSTANT.SCHEMA.COURSE, courseSchema);
export default Course;
export { ICourse };
