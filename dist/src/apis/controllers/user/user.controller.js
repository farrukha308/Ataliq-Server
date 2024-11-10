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
exports.validateQuestionRetriveEmail = exports.validateQuestionAnswer = exports.checkUserAccount = exports.unarchiveRequest = exports.resetPassword = exports.sendOTPEmail = exports.checkUserByObject = exports.getUserPermissions = exports.createUser = exports.signupEmail = exports.signinEmail = void 0;
const mongodb_1 = __importDefault(require("../../../wrapper/mongodb"));
const models_1 = __importDefault(require("../../models"));
const constant_1 = __importDefault(require("../../../constant/constant"));
const cache_1 = require("../../../middlewares/cache");
const helper_1 = require("../../../utils/helper");
const logger_1 = require("../../../utils/logger");
const auth_1 = require("../../../middlewares/auth");
const bcrypt_1 = __importStar(require("../../../wrapper/bcrypt"));
const email_1 = __importDefault(require("../../../utils/email"));
const otp_utils_1 = require("../../../utils/otp.utils");
const masking_1 = require("../../../utils/masking");
//! Signup
const signupEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password, confirmPassword, userRoleID,
    // secretQuestions
     } = req.body;
    //! Password mismatch check
    if (password !== confirmPassword) {
        (0, logger_1.auditLog)('Password and confirm password do not match');
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Password and confirm password not the same",
        };
    }
    // //! Secret questions validation
    // let checkSecretQuestionExist = validateArrayObject(secretQuestions, ['question', 'answer']);
    // auditLog(`Secret Questions Validated: ${checkSecretQuestionExist.valid}`);
    // if (!checkSecretQuestionExist.valid) {
    //   auditLog(`Secret Questions Missing Fields: ${JSON.stringify(checkSecretQuestionExist.errors)}`);
    //   return {
    //     status: CONSTANT.RESPONSE_STATUS.FAIL,
    //     message: `Secret Questions Required: ${checkSecretQuestionExist.errors}`,
    //   };
    // }
    //! Check if the user already exists
    const userMongoObj = new mongodb_1.default(models_1.default.USER);
    let isUserExist = yield userMongoObj.find({ email });
    (0, logger_1.auditLog)(`User Exist Check for Email: ${email} | Result: ${isUserExist.length > 0}`);
    if (isUserExist.length > 0) {
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "User Already Exist.",
        };
    }
    //! User creation
    let userCreated = yield createUser(userRoleID, req.body);
    (0, logger_1.auditLog)(`User Created: ${userCreated === null || userCreated === void 0 ? void 0 : userCreated._id} | Status: ${userCreated === null || userCreated === void 0 ? void 0 : userCreated.status}`);
    if ((userCreated === null || userCreated === void 0 ? void 0 : userCreated.status) !== constant_1.default.RESPONSE_STATUS.FAIL) {
        // //! Attach user ID to secret questions
        // for (const [index, item] of secretQuestions.entries()) {
        //   secretQuestions[index].userId = userCreated._id;
        //   secretQuestions[index].answer = await hashData(secretQuestions[index]?.answer.toLowerCase());
        // }
        // auditLog(`Secret Questions Ready for Insertion: ${JSON.stringify(secretQuestions)}`);
        // //! Insert secret questions into the database
        // const secretQuestionObj = new MongooseWrapper<any>(MODELS.USER_SECRET_QUESTION);
        // await secretQuestionObj.bulkCreate(secretQuestions);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "User signup successfully",
        };
    }
    else {
        (0, logger_1.auditLog)('User Creation Failed');
        return userCreated;
    }
});
exports.signupEmail = signupEmail;
//! Login
const signinEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    //! Check if user exists by email
    const userMongoObj = new mongodb_1.default(models_1.default.USER);
    let isUserExist = yield userMongoObj.find({ email });
    (0, logger_1.auditLog)(`User Exist Check for Email: ${email} | Result: ${isUserExist.length > 0}`);
    if (isUserExist.length === 0) {
        (0, logger_1.auditLog)(`Sign In Failed: No User Found with Email: ${email}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "User Does Not Exist. Please Signup.",
        };
    }
    else if (!(yield new bcrypt_1.default().comparePassword(password, isUserExist[0].password))) {
        (0, logger_1.auditLog)(`Sign In Failed: Invalid Password for Email: ${email}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Invalid Email or Password.",
        };
    }
    else {
        //! User found and password is correct
        const user = isUserExist[0];
        const roleId = user.appRole;
        (0, logger_1.auditLog)(`User Authenticated: ${user._id} | Role ID: ${roleId}`);
        //! Fetch user permissions based on role ID
        const userPermissions = yield getUserPermissions(roleId);
        (0, logger_1.auditLog)(`User Permissions Fetched for Role ID: ${roleId} | Permissions Count: ${userPermissions.length}`);
        //! Create session and return user permissions in response
        let session = yield (0, auth_1.createSession)(user._id, userPermissions);
        (0, logger_1.auditLog)(`Session Created for User ID: ${user._id} | Session Token: ${session.token}`);
        return Object.assign(Object.assign({}, session), { userPermissions });
    }
});
exports.signinEmail = signinEmail;
//! Create new User
const createUser = (userRoleID, userData) => __awaiter(void 0, void 0, void 0, function* () {
    //! Fetching the app role based on the given userRoleID
    let appRole = (0, helper_1.getObject)(yield (0, cache_1.getCache)(constant_1.default.SCHEMA.APP_ROLES), "ROLE_ID", userRoleID);
    (0, logger_1.auditLog)(`App Role Fetch Attempt: userRoleID = ${userRoleID} | Result: ${appRole ? 'Success' : 'Failure'}`);
    if (appRole === null) {
        (0, logger_1.auditLog)(`Error: User role not exist. userRoleID = ${userRoleID}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: `Error: User role not exist. userRoleID = ${userRoleID}`,
        };
    }
    //! Hashing password if provided
    if (userData.password) {
        const hashedPassword = new bcrypt_1.default();
        userData.password = yield hashedPassword.hashPassword(userData.password);
        (0, logger_1.auditLog)(`Password Hashed for user with email: ${userData.email}`);
    }
    //! Constructing user object for creation
    let userObj = Object.assign(Object.assign({}, userData), { appRole: appRole._id, status: constant_1.default.USER_STATUS.REGISTER });
    const userMongoObj = new mongodb_1.default(models_1.default.USER);
    let userCreated = yield userMongoObj.create(userObj);
    (0, logger_1.auditLog)(`User Creation: email = ${userData.email} | Status: ${userCreated ? 'Success' : 'Failure'}`);
    return userCreated;
});
exports.createUser = createUser;
//! Get All User Permission by Role ID
const getUserPermissions = (roleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resourcePermissionModel = new mongodb_1.default(models_1.default.RESOURCE_PERMISSIONS);
        //! Fetching permissions by ROLE_ID
        (0, logger_1.auditLog)(`Fetching Permissions for Role ID: ${roleId}`);
        const permissions = yield resourcePermissionModel.find({ ROLE_ID: roleId });
        (0, logger_1.auditLog)(`Permissions Fetched for Role ID: ${roleId} | Permissions Count: ${permissions.length}`);
        //! Map to return relevant fields only
        if (permissions.length === 0)
            return [];
        else {
            return permissions.map((permission) => ({
                RESOURCE_NAME: permission.RESOURCE_NAME,
                VALUE: permission.VALUE,
                ATTIBUTE1: permission.ATTIBUTE1,
                ATTIBUTE2: permission.ATTIBUTE2,
                ATTIBUTE3: permission.ATTIBUTE3,
            }));
        }
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error Fetching Permissions for Role ID: ${roleId} | Error: ${error.message}`);
        throw new Error('Error fetching user permissions');
    }
});
exports.getUserPermissions = getUserPermissions;
//! Get User By User Data
const checkUserByObject = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { email } = req.body;
        (0, logger_1.auditLog)(`Checking if user with data ${JSON.stringify(userData)} exists`);
        // Find user by email
        const userMongoObj = new mongodb_1.default(models_1.default.USER);
        const user = yield userMongoObj.findUser(Object.assign({}, userData));
        if (!user) {
            (0, logger_1.auditLog)(`User with data ${JSON.stringify(userData)} does not exist`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "User not found",
                code: 404
            };
        }
        else if (user.isArchive) {
            (0, logger_1.auditLog)(`User with data ${JSON.stringify(userData)} is Archive.`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: `User is Archive.Need to unarchive user.`,
                reasonCode: constant_1.default.RESPONSE_CODE.USER_ARCHIVE,
                data: { userEmail: user.email }
            };
        }
        (0, logger_1.auditLog)(`User with data ${JSON.stringify(userData)} found`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "User exists",
            data: {
                fromEmail: (0, masking_1.maskEmail)(process.env.SMTP_FROM_EMAIL || ""),
                fromPhoneNumber: (0, masking_1.maskPhoneNumber)(process.env.SMTP_FROM_NUMBER || ""),
                userId: user._id
            }
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error checking user by email: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Server error",
            code: 500
        };
    }
});
exports.checkUserByObject = checkUserByObject;
//! Get User By User Data
const GetUserByObject = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { email } = req.body;
        (0, logger_1.auditLog)(`Checking if user with data ${JSON.stringify(userData)} exists`);
        // Find user by email
        const userMongoObj = new mongodb_1.default(models_1.default.USER);
        const user = yield userMongoObj.findUser(Object.assign({}, userData));
        if (!user) {
            (0, logger_1.auditLog)(`User with data ${JSON.stringify(userData)} does not exist`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "User not found",
                code: 404
            };
        }
        else if (user.isArchive) {
            (0, logger_1.auditLog)(`User with data ${JSON.stringify(userData)} is Archive.`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: `User is Archive.Need to unarchive user.`,
                reasonCode: constant_1.default.RESPONSE_CODE.USER_ARCHIVE,
                data: { userEmail: user.email }
            };
        }
        (0, logger_1.auditLog)(`User with data ${JSON.stringify(userData)} found`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: `User exist.`,
            data: { userEmail: user.email }
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error checking user by email: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Server error",
            code: 500
        };
    }
});
//! Send OTP ( Email )
const sendOTPEmail = (email_2, ...args_1) => __awaiter(void 0, [email_2, ...args_1], void 0, function* (email, emailTemplateName = constant_1.default.EMAIL_TEMPLATE.SEND_PASSCODE) {
    try {
        // Log the initiation of the OTP sending process
        (0, logger_1.auditLog)(`OTP request initiated for email: ${email}`);
        if (!email) {
            (0, logger_1.auditLog)(`Email not provided in request`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Email is required',
                code: 400
            };
        }
        // Generate OTP and save to DB
        const otpCode = yield (0, otp_utils_1.createOTP)(email); // OTP expiry time set to 10 minutes
        (0, logger_1.auditLog)(`OTP ${otpCode} generated and saved for email: ${email}`);
        // Retrieve the email template from cache
        let emailTemplates = yield (0, cache_1.getCache)(constant_1.default.CACHE.EMAIL_TEMPLATE);
        if (!emailTemplates) {
            (0, logger_1.auditLog)('No email templates found in cache');
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Email template not found in configration',
                code: 500
            };
        }
        // Filter the template by unique template name
        const template = (0, helper_1.getObject)(emailTemplates, 'name', emailTemplateName);
        if (!template) {
            (0, logger_1.auditLog)('Email template "SEND_PASSCODE" not found');
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Email template not found',
                code: 500
            };
        }
        (0, logger_1.auditLog)('Found email template "SEND_PASSCODE" in cache');
        // Dynamic values to fill in the template
        const emailTemplateValues = {
            otpCode,
            username: "User",
            expiryTime: process.env.OTP_EXPIRY || '10', // Hardcoded 10 minutes expiration
        };
        // Fill in the template with dynamic values
        // Send OTP email
        const emailSent = yield (0, email_1.default)(email, template, emailTemplateValues);
        if (emailSent.status === 'success') {
            (0, logger_1.auditLog)(`OTP email sent successfully to ${email}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.SUCCESS,
                message: 'OTP sent successfully in your email.',
                code: 200
            };
        }
        else {
            (0, logger_1.auditLog)(`Failed to send OTP email to ${email}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Failed to send OTP',
                code: 500
            };
        }
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error sending OTP email: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
});
exports.sendOTPEmail = sendOTPEmail;
//! Verifiy OTP & Update Password Reset
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let validateOPTResp = yield (0, otp_utils_1.verifyOTP)(req.body.email, req.body.otp);
        if (validateOPTResp.status === constant_1.default.RESPONSE_STATUS.FAIL)
            return validateOPTResp;
        else {
            let updatePasswordResp = yield updatePassword(req.body.email, req.body.newPassword);
            return updatePasswordResp;
        }
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error validating OTP and updating password: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
});
exports.resetPassword = resetPassword;
//! Update Password
const updatePassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If OTP is valid and not expired, update the user's password
        (0, logger_1.auditLog)(`OTP validated successfully for email: ${email}, updating password`);
        const userMongoObj = new mongodb_1.default(models_1.default.USER);
        const bcryptObj = new bcrypt_1.default();
        let password = yield bcryptObj.hashPassword(newPassword);
        let updatedObj = yield userMongoObj.updateByQuery({ email }, { password });
        if (updatedObj) {
            (0, logger_1.auditLog)(`Password updated successfully for email: ${email}`);
            // Respond with success
            return {
                status: constant_1.default.RESPONSE_STATUS.SUCCESS,
                message: 'Password updated successfully',
                code: 200
            };
        }
        else {
            (0, logger_1.auditLog)(`Password not updated successfully for email: ${email}!`);
            // Respond with success
            return {
                status: constant_1.default.RESPONSE_STATUS.SUCCESS,
                message: 'Password not updated successfully',
                code: 400
            };
        }
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error validating OTP and updating password: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
});
//! Create Request for User UnArchive
const unarchiveRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, requestTypes } = req.body;
        (0, logger_1.auditLog)(`Request to unarchive user with email: ${email}`);
        const userMongoObj = new mongodb_1.default(models_1.default.USER);
        const user = yield userMongoObj.findUser({ email: email });
        if (!user) {
            (0, logger_1.auditLog)(`User with email: ${email} not found`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'User not found',
                code: 404
            };
        }
        if (!user.isArchive) {
            (0, logger_1.auditLog)(`User with email: ${email} is already active`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'User is already active',
                code: 400
            };
        }
        if (user.firstName !== firstName) {
            (0, logger_1.auditLog)(`User with firstName: ${firstName} is invalid`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'invalid firstName',
                code: 400
            };
        }
        if (user.lastName !== lastName) {
            (0, logger_1.auditLog)(`User with lastName: ${lastName} is invalid`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'invalid lastName',
                code: 400
            };
        }
        return yield CreateRequest(user._id, requestTypes);
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error creating unarchive request: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, unable to create request',
            code: 500
        };
    }
});
exports.unarchiveRequest = unarchiveRequest;
//! Create Request
const CreateRequest = (userId, requestTypes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestMongoObj = new mongodb_1.default(models_1.default.APP_REQUEST);
        const requestData = requestTypes.map((type) => {
            return {
                targetUser: userId, // Set admin ID here if required
                requestType: type,
                requestBy: userId,
                createdAt: new Date(),
            };
        });
        const unarchiveRequest = yield requestMongoObj.bulkCreate(requestData);
        if (!unarchiveRequest) {
            (0, logger_1.auditLog)(`Error: Request for unarchive user with ID: ${userId} is failed.`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Server error, try again later',
                code: 500
            };
        }
        // Logging
        (0, logger_1.auditLog)(`Request created to unarchive user with ID: ${userId}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: 'Unarchive request created successfully',
            code: 200
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error validating OTP and updating password: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
});
//! Check User is Exist the get User Question ( Get user Email )
const checkUserAccount = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let isUserValidResp = yield checkUserByObject(userData);
        if (isUserValidResp.status === constant_1.default.RESPONSE_STATUS.FAIL)
            return isUserValidResp;
        else
            return yield getUserSecretQuestion(isUserValidResp.data.userId);
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error validating OTP and updating password: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
});
exports.checkUserAccount = checkUserAccount;
//! Get user Question by UserId
const getUserSecretQuestion = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, logger_1.auditLog)(`Fetching secret question for user with ID: ${userId}`);
        const questionObj = new mongodb_1.default(models_1.default.USER_SECRET_QUESTION);
        // Find the user's secret question by userId
        const userQuestion = yield questionObj.findOneLimit({ userId }, // Query by userId
        { question: 1, _id: 1 } // Return only the question and _id fields
        );
        if (!userQuestion) {
            (0, logger_1.auditLog)(`userQuestion with ID: ${userId} not found`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'No Question found',
                code: 404
            };
        }
        (0, logger_1.auditLog)(`Secret question found: ${userQuestion} for user with ID: ${userId}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: 'Secret question retrieved successfully',
            data: {
                userId,
                userQuestion
            }
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error fetching secret question for user, ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, unable to fetch secret question',
            code: 500
        };
    }
});
//! Validate Question By Answer
const validateQuestionAnswer = (questionId, providedAnswer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionObj = new mongodb_1.default(models_1.default.USER_SECRET_QUESTION);
        // Fetch the question document from the database using questionId
        const questionDoc = yield questionObj.findById(questionId);
        // If no document is found, log and return a failure response
        if (!questionDoc) {
            (0, logger_1.auditLog)(`Failed to find question with ID: ${questionId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Question not found',
                code: 404
            };
        }
        (0, logger_1.auditLog)(`User question fetch: ${questionDoc}`);
        // Validate if the provided answer matches the stored one
        const isValid = yield (0, bcrypt_1.checkHashData)(providedAnswer.toLowerCase(), questionDoc.answer);
        console.log(`Question Validation Status: ${isValid}`);
        if (isValid) {
            (0, logger_1.auditLog)(`Successfully validated answer for question with ID: ${questionId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.SUCCESS,
                message: 'Answer is correct',
                code: 200
            };
        }
        else {
            (0, logger_1.auditLog)(`Validation failed: incorrect answer for question with ID: ${questionId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: 'Incorrect answer',
                code: 400
            };
        }
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error occurred during question validation for ID: ${questionId} - ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Internal server error',
            code: 500
        };
    }
});
exports.validateQuestionAnswer = validateQuestionAnswer;
//! Validate Question and send Email in response
const validateQuestionRetriveEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let validateSecretQuestionResp = yield validateQuestionAnswer(req.body.questionId, req.body.answer);
        if (validateSecretQuestionResp.status === constant_1.default.RESPONSE_STATUS.FAIL)
            return validateSecretQuestionResp;
        else {
            let userData = yield GetUserByObject({
                dateOfBirth: req.body.dateOfBirth,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            });
            if (userData.status === constant_1.default.RESPONSE_STATUS.FAIL)
                return userData;
            else
                return {
                    status: constant_1.default.RESPONSE_STATUS.SUCCESS,
                    message: 'Validate Secret Question Successfully',
                    code: 200,
                    data: userData.data
                };
        }
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error validating OTP and updating password: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
});
exports.validateQuestionRetriveEmail = validateQuestionRetriveEmail;
//# sourceMappingURL=user.controller.js.map