import { Request, Response } from "express";
import MongooseWrapper from "../../../wrapper/mongodb";
import MODELS from "../../models";
import CONSTANT from "../../../constant/constant";
import { getCache } from "../../../middlewares/cache";
import { getObject, validateArrayObject } from "../../../utils/helper";
import { IUser, userDataType } from "../../models/users/user.model";
import { auditLog } from "../../../utils/logger";
import { createSession } from "../../../middlewares/auth";
import BcryptWrapper, { checkHashData, hashData } from "../../../wrapper/bcrypt";
import { IResourcePermission } from "../../models/configs/resourcePermission.model";
import sendEmail from "../../../utils/email";
import { createOTP, verifyOTP } from "../../../utils/otp.utils";
import { IEmailTemplate } from "../../models/configs/emailTemplate.model";
import { IOTP } from "../../models/configs/otp.model";
import { IRequest } from "../../models/configs/appRequest.model";
import { ObjectId } from "mongodb";
import { IUserSecretQuestion } from "../../models/users/secretQuestion.model";
import { maskEmail, maskPhoneNumber } from "../../../utils/masking";
import { DefaultResponse } from "../../../utils/globalTypes";

//! Signup
const signupEmail = async (req: Request, res: Response) => {
  let {
    email,
    password,
    confirmPassword,
    userRoleID,
    // secretQuestions
  } = req.body;

  //! Password mismatch check
  if (password !== confirmPassword) {
    auditLog('Password and confirm password do not match');
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
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
  const userMongoObj = new MongooseWrapper<any>(MODELS.USER);
  let isUserExist = await userMongoObj.find({ email });

  auditLog(`User Exist Check for Email: ${email} | Result: ${isUserExist.length > 0}`);
  if (isUserExist.length > 0) {
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: "User Already Exist.",
    };
  }

  //! User creation
  let userCreated = await createUser(userRoleID, req.body);
  auditLog(`User Created: ${userCreated?._id} | Status: ${userCreated?.status}`);

  if (userCreated?.status !== CONSTANT.RESPONSE_STATUS.FAIL) {
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
      status: CONSTANT.RESPONSE_STATUS.SUCCESS,
      message: "User signup successfully",
    };
  } else {
    auditLog('User Creation Failed');
    return userCreated;
  }
};

//! Login
const signinEmail = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  //! Check if user exists by email
  const userMongoObj = new MongooseWrapper<any>(MODELS.USER);
  let isUserExist = await userMongoObj.find({ email });

  auditLog(`User Exist Check for Email: ${email} | Result: ${isUserExist.length > 0}`);

  if (isUserExist.length === 0) {
    auditLog(`Sign In Failed: No User Found with Email: ${email}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: "User Does Not Exist. Please Signup.",
    };
  } else if (!await new BcryptWrapper().comparePassword(password, isUserExist[0].password)) {
    auditLog(`Sign In Failed: Invalid Password for Email: ${email}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: "Invalid Email or Password.",
    };
  } else {
    //! User found and password is correct
    const user = isUserExist[0];
    const roleId = user.appRole;
    auditLog(`User Authenticated: ${user._id} | Role ID: ${roleId}`);

    //! Fetch user permissions based on role ID
    const userPermissions = await getUserPermissions(roleId);
    auditLog(`User Permissions Fetched for Role ID: ${roleId} | Permissions Count: ${userPermissions.length}`);

    //! Create session and return user permissions in response
    let session = await createSession(user._id, userPermissions);
    auditLog(`Session Created for User ID: ${user._id} | Session Token: ${session.token}`);

    return {
      ...session,
      userPermissions,
      grade: isUserExist[0].class
    };
  }
};

//! Create new User
const createUser = async (
  userRoleID: number,
  userData: userDataType
) => {
  //! Fetching the app role based on the given userRoleID
  let appRole: any = getObject(
    await getCache(CONSTANT.SCHEMA.APP_ROLES),
    "ROLE_ID",
    userRoleID
  );

  auditLog(`App Role Fetch Attempt: userRoleID = ${userRoleID} | Result: ${appRole ? 'Success' : 'Failure'}`);

  if (appRole === null) {
    auditLog(`Error: User role not exist. userRoleID = ${userRoleID}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: `Error: User role not exist. userRoleID = ${userRoleID}`,
    };
  }

  //! Hashing password if provided
  if (userData.password) {
    const hashedPassword = new BcryptWrapper();
    userData.password = await hashedPassword.hashPassword(userData.password);
    auditLog(`Password Hashed for user with email: ${userData.email}`);
  }

  //! Constructing user object for creation
  let userObj = <IUser>{
    ...userData,
    appRole: appRole._id,
    status: CONSTANT.USER_STATUS.REGISTER,
  };

  const userMongoObj = new MongooseWrapper<any>(MODELS.USER);
  let userCreated = await userMongoObj.create(userObj);

  auditLog(`User Creation: email = ${userData.email} | Status: ${userCreated ? 'Success' : 'Failure'}`);
  return userCreated;
};

//! Get All User Permission by Role ID
const getUserPermissions = async (roleId: string) => {
  try {
    const resourcePermissionModel = new MongooseWrapper<IResourcePermission>(MODELS.RESOURCE_PERMISSIONS);

    //! Fetching permissions by ROLE_ID
    auditLog(`Fetching Permissions for Role ID: ${roleId}`);
    const permissions: IResourcePermission[] = await resourcePermissionModel.find({ ROLE_ID: roleId });

    auditLog(`Permissions Fetched for Role ID: ${roleId} | Permissions Count: ${permissions.length}`);

    //! Map to return relevant fields only
    if (permissions.length === 0) return []
    else {
      return permissions.map((permission: IResourcePermission) => ({
        RESOURCE_NAME: permission.RESOURCE_NAME,
        VALUE: permission.VALUE,
        ATTIBUTE1: permission.ATTIBUTE1,
        ATTIBUTE2: permission.ATTIBUTE2,
        ATTIBUTE3: permission.ATTIBUTE3,
      }));
    }

  } catch (error: any) {
    auditLog(`Error Fetching Permissions for Role ID: ${roleId} | Error: ${error.message}`);
    throw new Error('Error fetching user permissions');
  }
};

//! Get User By User Data
const checkUserByObject = async (userData: Object) => {
  try {
    // const { email } = req.body;

    auditLog(`Checking if user with data ${JSON.stringify(userData)} exists`);

    // Find user by email
    const userMongoObj = new MongooseWrapper<IUser>(MODELS.USER);
    const user = await userMongoObj.findUser({ ...userData });

    if (!user) {
      auditLog(`User with data ${JSON.stringify(userData)} does not exist`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: "User not found",
        code: 404
      }
    }

    else if (user.isArchive) {
      auditLog(`User with data ${JSON.stringify(userData)} is Archive.`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: `User is Archive.Need to unarchive user.`,
        reasonCode: CONSTANT.RESPONSE_CODE.USER_ARCHIVE,
        data: { userEmail: user.email }
      }
    }

    auditLog(`User with data ${JSON.stringify(userData)} found`);
    return {
      status: CONSTANT.RESPONSE_STATUS.SUCCESS,
      message: "User exists",
      data: {
        fromEmail: maskEmail(process.env.SMTP_FROM_EMAIL || ""),
        fromPhoneNumber: maskPhoneNumber(process.env.SMTP_FROM_NUMBER || ""),
        userId: user._id
      }
    }
  } catch (error: any) {
    auditLog(`Error checking user by email: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: "Server error",
      code: 500
    }
  }
};

//! Get User By User Data
const GetUserByObject = async (userData: Object) => {
  try {
    // const { email } = req.body;

    auditLog(`Checking if user with data ${JSON.stringify(userData)} exists`);

    // Find user by email
    const userMongoObj = new MongooseWrapper<IUser>(MODELS.USER);
    const user = await userMongoObj.findUser({ ...userData });

    if (!user) {
      auditLog(`User with data ${JSON.stringify(userData)} does not exist`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: "User not found",
        code: 404
      }
    }

    else if (user.isArchive) {
      auditLog(`User with data ${JSON.stringify(userData)} is Archive.`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: `User is Archive.Need to unarchive user.`,
        reasonCode: CONSTANT.RESPONSE_CODE.USER_ARCHIVE,
        data: { userEmail: user.email }
      }
    }

    auditLog(`User with data ${JSON.stringify(userData)} found`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: `User exist.`,
      data: { userEmail: user.email }
    }
  } catch (error: any) {
    auditLog(`Error checking user by email: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: "Server error",
      code: 500
    }
  }
};

//! Send OTP ( Email )
const sendOTPEmail = async (email: string, emailTemplateName: string = CONSTANT.EMAIL_TEMPLATE.SEND_PASSCODE) => {
  try {

    // Log the initiation of the OTP sending process
    auditLog(`OTP request initiated for email: ${email}`);

    if (!email) {
      auditLog(`Email not provided in request`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'Email is required',
        code: 400
      }
    }

    // Generate OTP and save to DB
    const otpCode = await createOTP(email); // OTP expiry time set to 10 minutes

    auditLog(`OTP ${otpCode} generated and saved for email: ${email}`);

    // Retrieve the email template from cache
    let emailTemplates: any = await getCache(CONSTANT.CACHE.EMAIL_TEMPLATE);

    if (!emailTemplates) {
      auditLog('No email templates found in cache');
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'Email template not found in configration',
        code: 500
      }
    }

    // Filter the template by unique template name
    const template = <IEmailTemplate>getObject(emailTemplates, 'name', emailTemplateName)

    if (!template) {
      auditLog('Email template "SEND_PASSCODE" not found');
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'Email template not found',
        code: 500
      }
    }

    auditLog('Found email template "SEND_PASSCODE" in cache');

    // Dynamic values to fill in the template
    const emailTemplateValues = {
      otpCode,
      username: "User",
      expiryTime: process.env.OTP_EXPIRY || '10', // Hardcoded 10 minutes expiration
    };

    // Fill in the template with dynamic values

    // Send OTP email
    const emailSent = await sendEmail(email, template, emailTemplateValues);

    if (emailSent.status === 'success') {
      auditLog(`OTP email sent successfully to ${email}`);
      return {
        status: CONSTANT.RESPONSE_STATUS.SUCCESS,
        message: 'OTP sent successfully in your email.',
        code: 200
      }
    } else {
      auditLog(`Failed to send OTP email to ${email}`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'Failed to send OTP',
        code: 500
      }
    }

  } catch (error: any) {
    auditLog(`Error sending OTP email: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, try again later',
      code: 500
    }
  }
};

//! Verifiy OTP & Update Password Reset
const resetPassword = async (req: Request, res: Response) => {
  try {

    let validateOPTResp = await verifyOTP(req.body.email, req.body.otp);

    if (validateOPTResp.status === CONSTANT.RESPONSE_STATUS.FAIL)
      return validateOPTResp;
    else {
      let updatePasswordResp = await updatePassword(req.body.email, req.body.newPassword)
      return updatePasswordResp
    }

  } catch (error: any) {
    auditLog(`Error validating OTP and updating password: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, try again later',
      code: 500
    };
  }
}

//! Update Password
const updatePassword = async (email: string, newPassword: string) => {
  try {
    // If OTP is valid and not expired, update the user's password
    auditLog(`OTP validated successfully for email: ${email}, updating password`);

    const userMongoObj = new MongooseWrapper<IUser>(MODELS.USER);
    const bcryptObj = new BcryptWrapper();
    let password = await bcryptObj.hashPassword(newPassword);

    let updatedObj = await userMongoObj.updateByQuery({ email }, { password })

    if (updatedObj) {
      auditLog(`Password updated successfully for email: ${email}`);

      // Respond with success
      return {
        status: CONSTANT.RESPONSE_STATUS.SUCCESS,
        message: 'Password updated successfully',
        code: 200
      };
    }

    else {
      auditLog(`Password not updated successfully for email: ${email}!`);

      // Respond with success
      return {
        status: CONSTANT.RESPONSE_STATUS.SUCCESS,
        message: 'Password not updated successfully',
        code: 400
      };
    }
  } catch (error: any) {
    auditLog(`Error validating OTP and updating password: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, try again later',
      code: 500
    };
  }
}

//! Create Request for User UnArchive
const unarchiveRequest = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, requestTypes } = req.body;

    auditLog(`Request to unarchive user with email: ${email}`);

    const userMongoObj = new MongooseWrapper<IUser>(MODELS.USER);
    const user = await userMongoObj.findUser({ email: email });

    if (!user) {
      auditLog(`User with email: ${email} not found`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'User not found',
        code: 404
      };
    }

    if (!user.isArchive) {
      auditLog(`User with email: ${email} is already active`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'User is already active',
        code: 400
      };
    }

    if (user.firstName !== firstName) {
      auditLog(`User with firstName: ${firstName} is invalid`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'invalid firstName',
        code: 400
      };
    }

    if (user.lastName !== lastName) {
      auditLog(`User with lastName: ${lastName} is invalid`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'invalid lastName',
        code: 400
      };
    }

    return await CreateRequest(user._id as ObjectId, requestTypes)

  } catch (error: any) {
    auditLog(`Error creating unarchive request: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, unable to create request',
      code: 500
    };
  }
};

//! Create Request
const CreateRequest = async (userId: ObjectId, requestTypes: string[]): Promise<any> => {
  try {
    const requestMongoObj = new MongooseWrapper<IRequest>(MODELS.APP_REQUEST);

    const requestData = requestTypes.map((type: string) => {
      return {
        targetUser: userId, // Set admin ID here if required
        requestType: type,
        requestBy: userId,
        createdAt: new Date(),
      };
    });

    const unarchiveRequest = await requestMongoObj.bulkCreate(requestData);

    if (!unarchiveRequest) {
      auditLog(`Error: Request for unarchive user with ID: ${userId} is failed.`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'Server error, try again later',
        code: 500
      };
    }

    // Logging
    auditLog(`Request created to unarchive user with ID: ${userId}`);

    return {
      status: CONSTANT.RESPONSE_STATUS.SUCCESS,
      message: 'Unarchive request created successfully',
      code: 200
    }

  } catch (error: any) {
    auditLog(`Error validating OTP and updating password: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, try again later',
      code: 500
    };
  }
}

//! Check User is Exist the get User Question ( Get user Email )
const checkUserAccount = async (userData: Object) => {
  try {

    let isUserValidResp: any = await checkUserByObject(userData)

    if (isUserValidResp.status === CONSTANT.RESPONSE_STATUS.FAIL)
      return isUserValidResp

    else
      return await getUserSecretQuestion(isUserValidResp.data.userId)

  } catch (error: any) {
    auditLog(`Error validating OTP and updating password: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, try again later',
      code: 500
    };
  }
}

//! Get user Question by UserId
const getUserSecretQuestion = async (userId: string) => {
  try {
    auditLog(`Fetching secret question for user with ID: ${userId}`);

    const questionObj = new MongooseWrapper<IUserSecretQuestion>(MODELS.USER_SECRET_QUESTION);

    // Find the user's secret question by userId
    const userQuestion = await questionObj.findOneLimit(
      { userId },  // Query by userId
      { question: 1, _id: 1 } // Return only the question and _id fields
    );

    if (!userQuestion) {
      auditLog(`userQuestion with ID: ${userId} not found`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'No Question found',
        code: 404
      };
    }

    auditLog(`Secret question found: ${userQuestion} for user with ID: ${userId}`);

    return {
      status: CONSTANT.RESPONSE_STATUS.SUCCESS,
      message: 'Secret question retrieved successfully',
      data: {
        userId,
        userQuestion
      }
    };

  } catch (error: any) {
    auditLog(`Error fetching secret question for user, ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, unable to fetch secret question',
      code: 500
    };
  }
};

//! Validate Question By Answer
const validateQuestionAnswer = async (questionId: string, providedAnswer: string): Promise<{ status: string, message: string, code: number }> => {
  try {
    const questionObj = new MongooseWrapper<IUserSecretQuestion>(MODELS.USER_SECRET_QUESTION);

    // Fetch the question document from the database using questionId
    const questionDoc = await questionObj.findById(questionId);

    // If no document is found, log and return a failure response
    if (!questionDoc) {
      auditLog(`Failed to find question with ID: ${questionId}`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'Question not found',
        code: 404
      };
    }

    auditLog(`User question fetch: ${questionDoc}`)

    // Validate if the provided answer matches the stored one
    const isValid = await checkHashData(providedAnswer.toLowerCase(), questionDoc.answer);

    console.log(`Question Validation Status: ${isValid}`)

    if (isValid) {
      auditLog(`Successfully validated answer for question with ID: ${questionId}`);
      return {
        status: CONSTANT.RESPONSE_STATUS.SUCCESS,
        message: 'Answer is correct',
        code: 200
      };
    } else {
      auditLog(`Validation failed: incorrect answer for question with ID: ${questionId}`);
      return {
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: 'Incorrect answer',
        code: 400
      };
    }

  } catch (error: any) {
    auditLog(`Error occurred during question validation for ID: ${questionId} - ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Internal server error',
      code: 500
    };
  }
}

//! Validate Question and send Email in response
const validateQuestionRetriveEmail = async (req: Request, res: Response) => {
  try {

    let validateSecretQuestionResp = await validateQuestionAnswer(req.body.questionId, req.body.answer);

    if (validateSecretQuestionResp.status === CONSTANT.RESPONSE_STATUS.FAIL)
      return validateSecretQuestionResp;
    else {
      let userData = await GetUserByObject({
        dateOfBirth: req.body.dateOfBirth,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      })

      if (userData.status === CONSTANT.RESPONSE_STATUS.FAIL)
        return userData
      else return {
        status: CONSTANT.RESPONSE_STATUS.SUCCESS,
        message: 'Validate Secret Question Successfully',
        code: 200,
        data: userData.data
      };
    }

  } catch (error: any) {
    auditLog(`Error validating OTP and updating password: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: 'Server error, try again later',
      code: 500
    };
  }
}

export {
  signinEmail,
  signupEmail,
  createUser,
  getUserPermissions,
  checkUserByObject,
  sendOTPEmail,
  resetPassword,
  unarchiveRequest,
  checkUserAccount,
  validateQuestionAnswer,
  validateQuestionRetriveEmail
};
