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
const logger_1 = require("../utils/logger");
const cache_1 = require("./cache");
const constant_1 = __importDefault(require("../constant/constant"));
const helper_1 = require("../utils/helper");
const validateRequest = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            (0, logger_1.auditLog)(`Running validateRequest middleware for route: ${req.originalUrl}`);
            let validators = yield (0, cache_1.getCache)(constant_1.default.CACHE.REQUEST_VALIDATOR);
            let validator;
            if (validators) {
                if (process.env.IS_REDIS_ENABLE === "Y")
                    validators = JSON.parse(validators);
                let route = (0, helper_1.getRouteName)(req.originalUrl);
                validator = validators === null || validators === void 0 ? void 0 : validators.filter((validator) => validator.VALIDATOR_ROUTE_URL === route);
                if (validator.length > 0) {
                    (0, logger_1.auditLog)(`Validator found for route: ${req.originalUrl}`);
                    validator = (_a = validator[0]) === null || _a === void 0 ? void 0 : _a.VALIDATOR_FIELDES;
                }
                else {
                    (0, logger_1.auditLog)(`No specific validator found for route: ${req.originalUrl}`);
                    validator = [];
                }
            }
            else {
                (0, logger_1.auditLog)(`No validators found in cache for route: ${req.originalUrl}`);
                validator = [];
            }
            let response = validateAndHandleRequest(req, res, validator);
            if (response.status === constant_1.default.RESPONSE_STATUS.SUCCESS) {
                (0, logger_1.auditLog)(`Request validation passed for route: ${req.originalUrl}`);
                next();
            }
            else {
                (0, logger_1.auditLog)(`Validation error: ${JSON.stringify(response)} for route: ${req.originalUrl}`);
                res.status(400).json(response);
            }
        }
        catch (error) {
            (0, logger_1.auditLog)(`Error in validateRequest: ${error.message}`);
            console.error(error.message);
            return res.status(401).send(error.message);
        }
    });
};
function validateRequestBody(body, requiredParams) {
    const missingParams = requiredParams.filter((param) => !((param in body) &&
        body[param] !== "" &&
        body[param] !== null));
    if (missingParams.length > 0) {
        (0, logger_1.auditLog)(`Missing required parameters: ${missingParams.join(", ")}`);
    }
    else {
        (0, logger_1.auditLog)(`All required parameters present: ${requiredParams.join(", ")}`);
    }
    return {
        isValid: missingParams.length === 0,
        missingParams,
    };
}
function validateAndHandleRequest(req, res, requiredParams) {
    if (requiredParams.length === 0) {
        (0, logger_1.auditLog)(`No required parameters for route: ${req.originalUrl}`);
        return { status: constant_1.default.RESPONSE_STATUS.SUCCESS, message: "No required params", responseCode: 0 };
    }
    if (!req.body) {
        (0, logger_1.auditLog)(`Request body is empty for route: ${req.originalUrl}`);
        return {
            status: "error",
            message: "Bad Request",
            details: "Request body is empty",
            responseCode: -1
        };
    }
    const validationResult = validateRequestBody(req.body, requiredParams);
    if (!validationResult.isValid) {
        (0, logger_1.auditLog)(`Validation failed. Missing parameters: ${validationResult.missingParams.join(", ")}`);
        return {
            status: "error",
            message: "Bad Request",
            missingParams: validationResult.missingParams,
            details: `The following required parameters are missing: ${validationResult.missingParams.join(", ")}`,
            responseCode: -1
        };
    }
    (0, logger_1.auditLog)(`Request body is valid for route: ${req.originalUrl}`);
    return {
        status: constant_1.default.RESPONSE_STATUS.SUCCESS,
        message: "Request body is valid!",
        responseCode: 0
    };
}
exports.default = validateRequest;
//# sourceMappingURL=validateRequest.js.map