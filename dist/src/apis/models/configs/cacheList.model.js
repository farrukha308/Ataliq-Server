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
const cacheSchema = new mongoose_1.Schema({
    CACHE_NAME: {
        type: String,
        required: true,
        unique: true
    },
    CACHE_SCHEMA_NAME: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String,
        required: true,
        default: 'SCRIPT'
    },
    isArchive: {
        type: Boolean,
        default: false
    },
});
const CacheList = mongoose_1.default.model(constant_1.default.SCHEMA.CACHE_LIST, cacheSchema);
exports.default = CacheList;
//! Script Structure
// {
//     "data1": "qwejdfklsf1",
//     "schema": "CACHE_LIST",
//       "data2": [{
//           "CACHE_NAME": "emailTemplate",
//           "CACHE_SCHEMA_NAME": "EMAIL_TEMPLATE"
//       },
//       {
//           "CACHE_NAME": "appRequests",
//           "CACHE_SCHEMA_NAME": "APP_REQUEST"
//       }]
//   }
//# sourceMappingURL=cacheList.model.js.map