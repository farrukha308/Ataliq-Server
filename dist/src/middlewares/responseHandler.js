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
exports.ResponseHandler = void 0;
const logger_1 = require("../utils/logger");
const constant_1 = __importDefault(require("../constant/constant"));
const ResponseHandler = function (data, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, logger_1.auditLog)(`ResponseHandler called. Data received: ${JSON.stringify(data)}`);
            if ((data === null || data === void 0 ? void 0 : data.status) === constant_1.default.RESPONSE_STATUS.SUCCESS) {
                (0, logger_1.auditLog)(`Handling Success response.`);
                SuccessHandler(data, req, res);
            }
            else if ((data === null || data === void 0 ? void 0 : data.status) === constant_1.default.RESPONSE_STATUS.FAIL) {
                (0, logger_1.auditLog)(`Handling Error response.`);
                ErrorHandler(data, req, res);
            }
            else {
                (0, logger_1.auditLog)(`Unauthorized access attempt detected.`);
                return res.status(401).send("Unauthorized access");
            }
        }
        catch (error) {
            (0, logger_1.auditLog)(`Error in ResponseHandler: ${error.message}`);
            console.error(error.message);
            return res.status(401).send("Unauthorized access");
        }
    });
};
exports.ResponseHandler = ResponseHandler;
const ErrorHandler = (err, req, res) => {
    (0, logger_1.auditLog)(`Error encountered: ${err.message || err}`);
    console.log("LOG 6 ", err);
    res.status(err.code ? err.code : 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.server_env === "dev" ? err : {}, // Only send stack trace in development
        responseCode: -1
    });
};
const SuccessHandler = (data, req, res) => {
    (0, logger_1.auditLog)(`Success Response: ${JSON.stringify(data)}`);
    res.status(200).json(Object.assign(Object.assign({}, data), { responseCode: 0 }));
};
//# sourceMappingURL=responseHandler.js.map