import { Request, Response, NextFunction } from "express";
import { getCache } from "./cache";
import CONSTANT from "../constant/constant";
import { getObject, getRouteName } from "../utils/helper";
import { ObjectId, Types } from "mongoose";
import { generateToken } from "../utils/jwt";
import { auditLog } from "../utils/logger";
import MongooseWrapper from "../wrapper/mongodb";
import MODELS from "../apis/models";
import { IUserSession } from "../apis/models/users/userSession.model";
import { IUser } from "../apis/models/users/user.model";
import { IAppRoles } from "../apis/models/configs/appRoles.model";
import { getUserPermissions } from "../apis/controllers/user/user.controller";

const { verifyToken } = require("./../utils/jwt");

const validateToken = async function (
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    auditLog(`Run validateToken middleware Function.`);
    auditLog(`req.header =>  ${JSON.stringify(req.headers)}`);
    auditLog(`req.body =>  ${JSON.stringify(req.body)}`);

    let nonAccessTokenRoutes: any = getObject(
      await getCache(CONSTANT.SCHEMA.APP_CONFIG),
      "NAME",
      CONSTANT.NO_ACCESS_TOKEN_ROUTES
    );
    auditLog(`Fetched Non-Access Token Routes: ${JSON.stringify(nonAccessTokenRoutes)}`);

    if (
      getRouteName(req.originalUrl) === "runScript" ||
      (nonAccessTokenRoutes &&
        nonAccessTokenRoutes.VALUE.includes(getRouteName(req.originalUrl)))
    ) {
      auditLog(`Route does not require token: ${getRouteName(req.originalUrl)}`);
      next();
    } else {
      const token = req.body.token || req.query.token || req.headers["x-access-token"];
      if (!token) {
        auditLog(`No token provided in request headers or body.`);
        res.status(401).json({ message: "Unauthorized access"});
      } else {
        auditLog(`Token found in request: ${token}`);
        const decodedResp = await verifyToken(token, process.env.SESSION_SECRET);

        if (decodedResp?.status === CONSTANT.RESPONSE_STATUS.SESSION_EXPIRE) 
          return res.status(401).json(decodedResp).send();

        auditLog(`Token decoded in request: ${JSON.stringify(decodedResp)}`);

        const sessionMongoObj = new MongooseWrapper(MODELS.USER_SESSION);
        const session = <IUserSession>await sessionMongoObj.findOne({ userId: decodedResp.decoded.userId, token });

        if (!session) {
          auditLog(`Session not found for token: ${token}`);
          res.status(401).json({ message: 'Session not found or expired', responseCode: 'SE01'}).send();
        }

        // Check if session is expired
        if (session?.expiresAt < new Date()) {
          auditLog(`Session expired for token: ${token}`);
          res.status(401).json({ message: 'Session expired' , responseCode: 'SE01'}).send();
        }

        auditLog(`Session validated successfully for user: ${decodedResp.decoded.userId}`);

        let newToken = await handleUserSession(req, res, session)
        console.log("newTokennewToken , ", newToken)
        req.userSession = session;
        next();
      }
    }
  } catch (error: any) {
    auditLog(`Error in validateToken middleware: ${error.message}`);
    res.status(401).json({ message: "Error: Unauthorized access"});
  }
};

const deleteSession = async (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    auditLog(`No token provided for logout.`);
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    auditLog(`Attempting to delete session for token: ${token}`);
    const sessionMongoObj = new MongooseWrapper(MODELS.USER_SESSION);
    await sessionMongoObj.findOneAndDelete({ token });

    auditLog(`Session deleted successfully for token: ${token}`);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err: any) {
    auditLog(`Error deleting session for token: ${token} | Error: ${err.message}`);
    res.status(500).json({ message: 'Error logging out' });
  }
};

const createSession = async (userId: Types.ObjectId, userPermission: object[]) => {
  auditLog(`Creating session for user: ${userId}`);

  // Create JWT token
  const token = await generateToken(
    { userId },
    process.env.SESSION_SECRET || "",
    process.env.SESSION_EXPIRY || ""
  );
  auditLog(`Generated JWT token for user: ${userId}`);

  // Calculate expiration time
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + Number(process.env.USER_SESSION_EXPIRY || "1"));
  auditLog(`Session expiry set for user: ${userId} | Expires At: ${expiresAt}`);

  // Save session to DB
  let sessionObj = <IUserSession>{
    userId,
    token,
    userPermission,
    expiresAt,
  };

  const sessionMongoObj = new MongooseWrapper(MODELS.USER_SESSION);
  await sessionMongoObj.create(sessionObj);

  auditLog(`Session created successfully for user: ${userId} | Token: ${token}`);

  return {
    status: CONSTANT.RESPONSE_STATUS.SUCCESS,
    message: "Login successfully",
    token,
  };
};

const handleUserSession = async (
  req: Request | any,
  res: Response,
  userSession: IUserSession) => {
  try {
    auditLog(`Starting process for handling user session for session ID: ${userSession._id}`);

    // 1. Get the user from userSession.userId
    const userMongoObj = new MongooseWrapper<IUser>(MODELS.SCHEMA.USER);
    const user = await userMongoObj.findById(userSession.userId as unknown as string);

    if (!user) {
      auditLog(`User with ID ${userSession.userId} not found`);
      return res.status(404).json({
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: "User not found",
      })
    }
    auditLog(`User with ID ${userSession.userId} found`);

    // 2. Extract roleID from user and get all permissions through roleID
    // const roleMongoObj = new MongooseWrapper<IAppRoles>(MODELS.ROLE);
    // const role = await roleMongoObj.findOne(user.appRole);
    // if (!role) {
    //   auditLog(`Role with ID ${user.appRole} not found for user ${userSession.userId}`);
    //   return {
    //     status: CONSTANT.RESPONSE_STATUS.FAIL,
    //     message: "Role not found",
    //     code: 404,
    //   };
    // }
    // auditLog(`Role with ID ${user.appRole} found`);

    const roleId = user.appRole;
    const userPermissions = await getUserPermissions(roleId as unknown as string);
    auditLog(`Permissions for role ID ${roleId} fetched successfully`);

    // 3. Archive current session using userSession._id
    const sessionMongoObj = new MongooseWrapper<IUserSession>(MODELS.SCHEMA.USER_SESSION);
    const archiveResult = await sessionMongoObj.deleteById(userSession._id as string);
    if (!archiveResult) {
      auditLog(`Failed to archive session with ID ${userSession._id}`);
      return res.status(500).json({
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: "Failed to archive session",
      })
    }
    auditLog(`Session with ID ${userSession._id} archived successfully`);

    // 4. Create new session using createSession function
    const newSession = await createSession(userSession.userId, userPermissions);
    if (!newSession) {
      auditLog(`Failed to create a new session for user ID ${userSession.userId}`);
      return res.status(500).json({
        status: CONSTANT.RESPONSE_STATUS.FAIL,
        message: "Failed to create new session",
      })
    }
    auditLog(`New session created successfully for user ID ${userSession.userId}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.SUCCESS,
      message: "User session handled successfully",
      newSession,
    };
  } catch (error: any) {
    auditLog(`Error handling user session: ${error.message}`);
    return {
      status: CONSTANT.RESPONSE_STATUS.FAIL,
      message: "Server error",
      code: 500,
    };
  }
};

export { validateToken, createSession, deleteSession, handleUserSession };
