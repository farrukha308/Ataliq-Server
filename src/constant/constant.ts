const CACHE = {
  ROLES: "ROLES",
  REQUEST_VALIDATOR: "REQUEST_VALIDATOR",
  APP_CONFIG: "APP_CONFIG",
  RESOURCE_PERMISSIONS: "RESOURCE_PERMISSIONS",
  EMAIL_TEMPLATE: "EMAIL_TEMPLATE"
};

const SCHEMA = {
  APP_ROLES: "APP_ROLES",
  REQUEST_VALIDATOR: "REQUEST_VALIDATOR",
  APP_CONFIG: "APP_CONFIG",
  RESOURCE_PERMISSIONS: "RESOURCE_PERMISSIONS",
  CACHE_LIST: "CACHE_LIST",
  USER: "USER",
  USER_TYPE: "USER_TYPE",
  USER_STATUS: "USER_STATUS",
  USER_SECRET_QUESTION: "USER_SECRET_QUESTION",
  USER_SESSION: "USER_SESSION",
  OTP: "OTP",
  EMAIL_TEMPLATE: "EMAIL_TEMPLATE",
  APP_REQUEST: "APP_REQUEST",
  DEPARTMENT: "DEPARTMENT",
  TEAM: "TEAM",
  ORGANIZATIONAL_UNIT: "ORGANIZATIONAL_UNIT",
  STUDENT_GRADE: "STUDENT_GRADE",
  COURSE_SUBJECT: "COURSE_SUBJECT",
  COURSE: "COURSE",
  SUBJECT_LECTURE: "SUBJECT_LECTURE"
}

const RESPONSE_STATUS = {
  SUCCESS: "success",
  FAIL: "fail",
  SESSION_EXPIRE: "session expire"
};

const RESPONSE_CODE = {
  USER_ARCHIVE: "UA200",
  SESSION_EXPIRE: "SE1"
}

const USER_STATUS = {
  REGISTER: "REGISTER",
  VERIFIED: "VERIFIED",
  TRIAL: "TRIAL",
  PAID: "PAID",
  PRESTIGE: "PRESTIGE",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
};

const APP_REQUEST_TYPE = {
  ACTIVATE_USER: "ACTIVATE_USER"
}

const EMAIL_TEMPLATE = {
  SEND_PASSCODE: "SEND_PASSCODE"
}

const ORGANIZATIONAL_UNIT_TYPES = {
  UNIT: "UNIT",
  TEAM: "TEAM",
  GROUP: "GROUP",
}

const constants = {
  NO_ACCESS_TOKEN_ROUTES: "NO_ACCESS_TOKEN_ROUTES",
  SESSION_COOKIE: "SESSION_COOKIE",
  APPROVED: "APPROVED",
  REJECT: "REJECT",
  PENDING: "PENDING",
  GRADE: 'grade'
};

const CONSTANT = {
  CACHE,
  SCHEMA,
  RESPONSE_STATUS,
  USER_STATUS,
  APP_REQUEST_TYPE,
  EMAIL_TEMPLATE,
  RESPONSE_CODE,
  ORGANIZATIONAL_UNIT_TYPES,
  ...constants,
};

export default CONSTANT;
