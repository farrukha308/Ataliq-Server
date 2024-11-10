"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_1 = __importDefault(require("../../../constant/constant"));
// Define the schema for the request
const RequestSchema = new mongoose_1.Schema({
    requestType: { type: String, required: true }, // Type of request (e.g., 'activate_user', 'change_role')
    requestBy: { type: mongoose_1.Schema.Types.ObjectId, ref: constant_1.default.SCHEMA.USER, required: true }, // Reference to the user or admin who made the request
    targetUser: { type: mongoose_1.Schema.Types.ObjectId, ref: constant_1.default.SCHEMA.USER }, // (Optional) The user this request is about (e.g., activating a user)
    status: {
        type: String,
        enum: [constant_1.default.PENDING, constant_1.default.REJECT, constant_1.default.APPROVED], // Request status
        default: constant_1.default.PENDING,
        required: true
    },
    reason: { type: String }, // Optional reason for the request
    actionDetails: { type: Object }, // Optional payload with extra details
    reviewedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: constant_1.default.SCHEMA.USER }, // (Optional) The admin who approved/rejected the request
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
const appRequest = (0, mongoose_1.model)(constant_1.default.SCHEMA.APP_REQUEST, RequestSchema);
exports.default = appRequest;
//# sourceMappingURL=appRequest.model.js.map