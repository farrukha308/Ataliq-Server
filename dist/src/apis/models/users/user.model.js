"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_1 = __importDefault(require("../../../constant/constant"));
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
    status: { type: String, required: true, default: constant_1.default.USER_STATUS.REGISTER },
    isArchive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    appRole: { type: mongoose_1.Schema.Types.ObjectId, ref: constant_1.default.SCHEMA.APP_ROLES, required: true },
    adminId: { type: mongoose_1.Schema.Types.ObjectId, ref: constant_1.default.SCHEMA.USER },
    googleId: { type: String, unique: true, sparse: true },
    appleId: { type: String, unique: true, sparse: true },
    linkedinId: { type: String, unique: true, sparse: true },
    googleAccessToken: { type: String },
    googleRefreshToken: { type: String },
    appleAccessToken: { type: String },
    appleRefreshToken: { type: String },
    linkedinAccessToken: { type: String },
    linkedinRefreshToken: { type: String },
    emailVerified: { type: Boolean, default: false },
    mobilePhone: { type: String }, // New field
    dateOfBirth: { type: String }, // New field
    board: { type: String }, // New field
    city: { type: String }, // New field
    class: { type: String } // New field
});
const User = (0, mongoose_1.model)(constant_1.default.SCHEMA.USER, userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map