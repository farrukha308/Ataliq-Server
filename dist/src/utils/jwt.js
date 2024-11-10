"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const constant_1 = __importDefault(require("../constant/constant"));
const logger_1 = require("./logger");
const jwt = require('jsonwebtoken');
const generateToken = (data, secret, expiresIn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, logger_1.auditLog)(`JWT Data ${data}`);
        const token = yield jwt.sign(data, secret, { expiresIn });
        return token;
    }
    catch (error) {
        console.error(error.message);
        (0, logger_1.auditLog)("Login error");
    }
});
exports.generateToken = generateToken;
const verifyToken = (token, secret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield jwt.verify(token, secret);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            decoded
        };
    }
    catch (error) {
        console.error(error.message);
        (0, logger_1.auditLog)(error);
        return {
            status: constant_1.default.RESPONSE_STATUS.SESSION_EXPIRE,
            message: error.message,
            reasonCode: constant_1.default.RESPONSE_CODE.SESSION_EXPIRE
        };
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map