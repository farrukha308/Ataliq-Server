"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const constant_1 = __importDefault(require("../../../constant/constant"));
const GradeSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model(constant_1.default.SCHEMA.STUDENT_GRADE, GradeSchema);
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
//# sourceMappingURL=studentGrade.model.js.map