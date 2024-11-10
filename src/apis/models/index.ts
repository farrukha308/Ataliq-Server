import appConfigModel from "./configs/appConfig.model";
import rolesModel from "./configs/appRoles.model";
import CacheList from "./configs/cacheList.model";
import requestValidatorModel from "./configs/requestValidator.model";
import resourcePermissionModel from "./configs/resourcePermission.model";
import User from "./users/user.model";
import CONSTANT from "../../constant/constant";
import UserType from "./users/userType.model";
import UserSecretQuestion from "./users/secretQuestion.model";
import userSession from "./users/userSession.model";
import OTP from "./configs/otp.model";
import EmailTemplate from "./configs/emailTemplate.model";
import appRequest from "./configs/appRequest.model";
import studentGradeModel from "./configs/studentGrade.model";
import Course from "./courses/course.model";
import Subject from "./subject/subject.model";
import Lecture from "./lecture/lecture.model";

//! Model Attribute Name will be same as Constant schema name
let MODELS: any = {
  [CONSTANT.SCHEMA.CACHE_LIST]: CacheList,
  [CONSTANT.SCHEMA.APP_ROLES]: rolesModel,
  [CONSTANT.SCHEMA.REQUEST_VALIDATOR]: requestValidatorModel,
  [CONSTANT.SCHEMA.APP_CONFIG]: appConfigModel,
  [CONSTANT.SCHEMA.RESOURCE_PERMISSIONS]: resourcePermissionModel,
  [CONSTANT.SCHEMA.USER]: User,
  [CONSTANT.SCHEMA.USER_TYPE]: UserType,
  [CONSTANT.SCHEMA.USER_SECRET_QUESTION]: UserSecretQuestion,
  [CONSTANT.SCHEMA.USER_SESSION]: userSession,
  [CONSTANT.SCHEMA.OTP]: OTP,
  [CONSTANT.SCHEMA.EMAIL_TEMPLATE]: EmailTemplate,
  [CONSTANT.SCHEMA.APP_REQUEST]: appRequest,
  [CONSTANT.SCHEMA.STUDENT_GRADE]: studentGradeModel,
  [CONSTANT.SCHEMA.COURSE_SUBJECT]: Subject,
  [CONSTANT.SCHEMA.COURSE]: Course,
  [CONSTANT.SCHEMA.SUBJECT_LECTURE]: Lecture
};

export default MODELS;
