"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_1 = __importDefault(require("../../../constant/constant"));
const userSecretQuestionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constant_1.default.SCHEMA.USER, // Reference to the user model
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    isArchive: {
        type: Boolean,
        default: false // Default to 'N', indicating the record is not deleted
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});
const UserSecretQuestion = (0, mongoose_1.model)(constant_1.default.SCHEMA.USER_SECRET_QUESTION, userSecretQuestionSchema);
exports.default = UserSecretQuestion;
//# sourceMappingURL=secretQuestion.model.js.map