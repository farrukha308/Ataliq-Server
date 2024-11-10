"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_1 = __importDefault(require("../../../constant/constant"));
const userTypeSchema = new mongoose_1.Schema({
    userTypeID: { type: Number, required: true, unique: true, },
    roleTitle: { type: String, required: true },
    description: { type: String },
    isArchive: { type: Boolean, default: false, },
    createdAt: { type: Date, default: Date.now },
});
const UserType = (0, mongoose_1.model)(constant_1.default.SCHEMA.USER_TYPE, userTypeSchema);
exports.default = UserType;
//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "USER_TYPE",
//   "data2": [{
//       "userTypeID": 1,
//       "roleTitle": "SYSTEM_ADMIN",
//       "description": ""
//   },
//   {
//       "userTypeID": 2,
//       "roleTitle": "ADMIN",
//       "description": ""
//   },
//   {
//       "userTypeID": 3,
//       "roleTitle": "CONTACT",
//       "description": ""
//   }]
// }
//# sourceMappingURL=userType.model.js.map