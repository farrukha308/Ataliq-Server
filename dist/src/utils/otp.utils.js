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
exports.verifyOTP = exports.createOTP = void 0;
const mongodb_1 = __importDefault(require("../wrapper/mongodb"));
const models_1 = __importDefault(require("../apis/models"));
const bcrypt_1 = __importDefault(require("../wrapper/bcrypt"));
const constant_1 = __importDefault(require("../constant/constant"));
const logger_1 = require("./logger");
// Function to generate a random OTP
const generateOTP = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (length = 6) {
    const min = Math.pow(10, length - 1); // Minimum number with the specified length
    const max = Math.pow(10, length) - 1; // Maximum number with the specified length
    let otp = "";
    if (process.env.server_env === "dev")
        otp = "0";
    else
        otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
    const encryptOTP = new bcrypt_1.default();
    return { otpCode: yield encryptOTP.hashPassword(otp), otp };
});
// Function to save OTP in the database
const createOTP = (email_1, ...args_1) => __awaiter(void 0, [email_1, ...args_1], void 0, function* (email, expiredTime = process.env.OPT_EXPIRY || '10') {
    let optObj = new mongodb_1.default(models_1.default.OTP);
    const { otpCode, otp } = yield generateOTP();
    const expiresAt = new Date(Date.now() + Number(expiredTime) * 60 * 1000); // OTP expires in 10 minutes
    // Create the OTP object
    const otpData = {
        email,
        expiresAt,
        otpCode,
    };
    yield optObj.create(otpData);
    return otp;
});
exports.createOTP = createOTP;
const verifyOTP = (email, otpCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, logger_1.auditLog)(`Verifying OTP for email: ${email}`);
        let optObj = new mongodb_1.default(models_1.default.OTP);
        const otp = yield optObj.findOne({ email });
        if (!otp) {
            (0, logger_1.auditLog)(`OTP verification failed: No OTP found for email: ${email}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Invalid OTP',
                code: 400
            };
        }
        if (!(yield new bcrypt_1.default().comparePassword(otpCode, otp === null || otp === void 0 ? void 0 : otp.otpCode))) {
            (0, logger_1.auditLog)(`OTP verification failed: Wrong OTP for email: ${email}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Wrong OTP',
                code: 400
            };
        }
        if (otp.expiresAt < new Date()) {
            (0, logger_1.auditLog)(`OTP verification failed: OTP expired for email: ${email}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'OTP expired',
                code: 400
            };
        }
        if (otp.verified) {
            (0, logger_1.auditLog)(`OTP verification failed: OTP already used for email: ${email}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'OTP already used',
                code: 400
            };
        }
        // Mark the OTP as verified
        let markotp = yield optObj.updateById(otp._id, { verified: true });
        (0, logger_1.auditLog)(`OTP verified successfully for email: ${email}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: 'OTP verified'
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`OTP verification failed due to server error for email: ${email}. Error: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
});
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=otp.utils.js.map