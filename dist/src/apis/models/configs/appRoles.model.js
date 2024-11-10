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
const appRoleSchema = new mongoose_1.Schema({
    ROLE_NAME: { type: String, required: true, unique: true },
    ROLE_ID: { type: Number, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: 'SCRIPT', required: true },
    isArchive: { type: Boolean, default: false },
});
// Exporting the model
const rolesModel = mongoose_1.default.model(constant_1.default.SCHEMA.APP_ROLES, appRoleSchema);
exports.default = rolesModel;
//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "APP_ROLES",
//   "data2": [
//   {
//       "ROLE_NAME": "STAFF",
//       "ROLE_ID": 1
//   },
//   {
//       "ROLE_NAME": "GUEST_PARENT",
//       "ROLE_ID": 2
//   },
//   {
//       "ROLE_NAME": "GUEST_PLAYER",
//       "ROLE_ID": 5
//   }]
// }
//# sourceMappingURL=appRoles.model.js.map