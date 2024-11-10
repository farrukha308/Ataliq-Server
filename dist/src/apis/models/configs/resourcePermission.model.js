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
const ResourcePermissionSchema = new mongoose_1.Schema({
    RESOURCE_NAME: { type: String, required: true, unique: true },
    VALUE: { type: mongoose_1.Schema.Types.Mixed, required: true }, // Mixed type for flexibility
    ROLE_ID: { type: mongoose_1.Schema.Types.ObjectId, ref: constant_1.default.SCHEMA.APP_ROLES, required: true },
    ATTIBUTE1: { type: mongoose_1.Schema.Types.Mixed }, // Reference to the roles model
    ATTIBUTE2: { type: mongoose_1.Schema.Types.Mixed }, // Reference to the roles model
    ATTIBUTE3: { type: mongoose_1.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: "SCRIPT", required: true },
    isArchive: { type: Boolean, default: false },
});
// Exporting the model
const resourcePermissionModel = mongoose_1.default.model(constant_1.default.SCHEMA.RESOURCE_PERMISSIONS, ResourcePermissionSchema);
exports.default = resourcePermissionModel;
//! Script Structure
// {
//   "data1": "qwejdfklsf1",
//   "schema": "RESOURCE_PERMISSIONS",
//   "data2": [
//     {
//       "RESOURCE_NAME": "Home Tab",
//       "VALUE": "TAB_HOME",
//       "ROLE_ID": 7,
//       "ATTIBUTE1": "",
//       "ATTIBUTE2": "",
//       "ATTIBUTE3": ""
//     },
//     {
//       "RESOURCE_NAME": "Chat Tab",
//       "VALUE": "TAB_CHAT",
//       "ROLE_ID": 7,
//       "ATTIBUTE1": "",
//       "ATTIBUTE2": "",
//       "ATTIBUTE3": ""
//     },
//   ]
// }
//# sourceMappingURL=resourcePermission.model.js.map