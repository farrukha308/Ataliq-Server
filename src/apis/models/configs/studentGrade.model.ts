import mongoose, { Schema, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface IGrade extends Document {
  name: string; // e.g., "Grade 6", "Grade 7"
  description?: string; // Optional description for the grade
  isArchive?: boolean; // For soft delete
}

const GradeSchema = new Schema<IGrade>({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures that grade names are unique
  },
  description: {
    type: String,
  },
  isArchive: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export default mongoose.model<IGrade>(CONSTANT.SCHEMA.STUDENT_GRADE, GradeSchema);

// {
//   "data1": "qwejdfklsf1",
//   "schema": "STUDENT_GRADE",
//   "data2": [
//       {
//           "name": "Grade 1",
//           "description": "Introduction to basic concepts and foundational subjects."
//       },
//       {
//           "name": "Grade 2",
//           "description": "Continuation of basic education with a focus on core subjects."
//       },
//       {
//           "name": "Grade 3",
//           "description": "Expansion of core subjects and introduction to new topics."
//       },
//       {
//           "name": "Grade 4",
//           "description": "Development of more complex concepts across core subjects."
//       },
//       {
//           "name": "Grade 5",
//           "description": "Further advancement of core knowledge and skills."
//       },
//       {
//           "name": "Grade 6",
//           "description": "Introduction to intermediate subjects and problem-solving."
//       },
//       {
//           "name": "Grade 7",
//           "description": "Exploration of more specialized topics in core subjects."
//       },
//       {
//           "name": "Grade 8",
//           "description": "Preparation for advanced studies with a focus on critical thinking."
//       },
//       {
//           "name": "Grade 9",
//           "description": "Introduction to advanced subjects, preparing for higher education."
//       },
//       {
//           "name": "Grade 10",
//           "description": "Completion of core education with advanced subjects and electives."
//       },
//       {
//           "name": "Grade 11",
//           "description": "Focus on specialized subjects based on career paths."
//       },
//       {
//           "name": "Grade 12",
//           "description": "Finalization of school education and preparation for college."
//       }
//   ]
// }