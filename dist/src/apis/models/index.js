"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appConfig_model_1 = __importDefault(require("./configs/appConfig.model"));
const appRoles_model_1 = __importDefault(require("./configs/appRoles.model"));
const cacheList_model_1 = __importDefault(require("./configs/cacheList.model"));
const requestValidator_model_1 = __importDefault(require("./configs/requestValidator.model"));
const resourcePermission_model_1 = __importDefault(require("./configs/resourcePermission.model"));
const user_model_1 = __importDefault(require("./users/user.model"));
const constant_1 = __importDefault(require("../../constant/constant"));
const userType_model_1 = __importDefault(require("./users/userType.model"));
const secretQuestion_model_1 = __importDefault(require("./users/secretQuestion.model"));
const userSession_model_1 = __importDefault(require("./users/userSession.model"));
const otp_model_1 = __importDefault(require("./configs/otp.model"));
const emailTemplate_model_1 = __importDefault(require("./configs/emailTemplate.model"));
const appRequest_model_1 = __importDefault(require("./configs/appRequest.model"));
const studentGrade_model_1 = __importDefault(require("./configs/studentGrade.model"));
const course_model_1 = __importDefault(require("./courses/course.model"));
const subject_model_1 = __importDefault(require("./subject/subject.model"));
const lecture_model_1 = __importDefault(require("./lecture/lecture.model"));
//! Model Attribute Name will be same as Constant schema name
let MODELS = {
    [constant_1.default.SCHEMA.CACHE_LIST]: cacheList_model_1.default,
    [constant_1.default.SCHEMA.APP_ROLES]: appRoles_model_1.default,
    [constant_1.default.SCHEMA.REQUEST_VALIDATOR]: requestValidator_model_1.default,
    [constant_1.default.SCHEMA.APP_CONFIG]: appConfig_model_1.default,
    [constant_1.default.SCHEMA.RESOURCE_PERMISSIONS]: resourcePermission_model_1.default,
    [constant_1.default.SCHEMA.USER]: user_model_1.default,
    [constant_1.default.SCHEMA.USER_TYPE]: userType_model_1.default,
    [constant_1.default.SCHEMA.USER_SECRET_QUESTION]: secretQuestion_model_1.default,
    [constant_1.default.SCHEMA.USER_SESSION]: userSession_model_1.default,
    [constant_1.default.SCHEMA.OTP]: otp_model_1.default,
    [constant_1.default.SCHEMA.EMAIL_TEMPLATE]: emailTemplate_model_1.default,
    [constant_1.default.SCHEMA.APP_REQUEST]: appRequest_model_1.default,
    [constant_1.default.SCHEMA.STUDENT_GRADE]: studentGrade_model_1.default,
    [constant_1.default.SCHEMA.COURSE_SUBJECT]: subject_model_1.default,
    [constant_1.default.SCHEMA.COURSE]: course_model_1.default,
    [constant_1.default.SCHEMA.SUBJECT_LECTURE]: lecture_model_1.default
};
exports.default = MODELS;
//# sourceMappingURL=index.js.map