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
exports.handleUserSession = exports.deleteSession = exports.createSession = exports.validateToken = void 0;
const cache_1 = require("./cache");
const constant_1 = __importDefault(require("../constant/constant"));
const helper_1 = require("../utils/helper");
const jwt_1 = require("../utils/jwt");
const logger_1 = require("../utils/logger");
const mongodb_1 = __importDefault(require("../wrapper/mongodb"));
const models_1 = __importDefault(require("../apis/models"));
const user_controller_1 = require("../apis/controllers/user/user.controller");
const { verifyToken } = require("./../utils/jwt");
const validateToken = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, logger_1.auditLog)(`Run validateToken middleware Function.`);
            let nonAccessTokenRoutes = (0, helper_1.getObject)(yield (0, cache_1.getCache)(constant_1.default.SCHEMA.APP_CONFIG), "NAME", constant_1.default.NO_ACCESS_TOKEN_ROUTES);
            (0, logger_1.auditLog)(`Fetched Non-Access Token Routes: ${JSON.stringify(nonAccessTokenRoutes)}`);
            if ((0, helper_1.getRouteName)(req.originalUrl) === "runScript" ||
                (nonAccessTokenRoutes &&
                    nonAccessTokenRoutes.VALUE.includes((0, helper_1.getRouteName)(req.originalUrl)))) {
                (0, logger_1.auditLog)(`Route does not require token: ${(0, helper_1.getRouteName)(req.originalUrl)}`);
                next();
            }
            else {
                const token = req.body.token || req.query.token || req.headers["x-access-token"];
                if (!token) {
                    (0, logger_1.auditLog)(`No token provided in request headers or body.`);
                    res.status(401).send("Unauthorized access");
                }
                else {
                    (0, logger_1.auditLog)(`Token found in request: ${token}`);
                    const decodedResp = yield verifyToken(token, process.env.SESSION_SECRET);
                    if ((decodedResp === null || decodedResp === void 0 ? void 0 : decodedResp.status) === constant_1.default.RESPONSE_STATUS.SESSION_EXPIRE)
                        res.status(401).json(decodedResp);
                    (0, logger_1.auditLog)(`Token decoded in request: ${JSON.stringify(decodedResp)}`);
                    const sessionMongoObj = new mongodb_1.default(models_1.default.USER_SESSION);
                    const session = yield sessionMongoObj.findOne({ userId: decodedResp.decoded.userId, token });
                    if (!session) {
                        (0, logger_1.auditLog)(`Session not found for token: ${token}`);
                        res.status(401).json({ message: 'Session not found or expired' });
                    }
                    // Check if session is expired
                    if (session.expiresAt < new Date()) {
                        (0, logger_1.auditLog)(`Session expired for token: ${token}`);
                        res.status(401).json({ message: 'Session expired' });
                    }
                    (0, logger_1.auditLog)(`Session validated successfully for user: ${decodedResp.decoded.userId}`);
                    let newToken = yield handleUserSession(req, res, session);
                    console.log("newTokennewToken , ", newToken);
                    req.userSession = session;
                    next();
                }
            }
        }
        catch (error) {
            (0, logger_1.auditLog)(`Error in validateToken middleware: ${error.message}`);
            res.status(401).send("Error: Unauthorized access");
        }
    });
};
exports.validateToken = validateToken;
const deleteSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        (0, logger_1.auditLog)(`No token provided for logout.`);
        return res.status(400).json({ message: 'No token provided' });
    }
    try {
        (0, logger_1.auditLog)(`Attempting to delete session for token: ${token}`);
        const sessionMongoObj = new mongodb_1.default(models_1.default.USER_SESSION);
        yield sessionMongoObj.findOneAndDelete({ token });
        (0, logger_1.auditLog)(`Session deleted successfully for token: ${token}`);
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        (0, logger_1.auditLog)(`Error deleting session for token: ${token} | Error: ${err.message}`);
        res.status(500).json({ message: 'Error logging out' });
    }
});
exports.deleteSession = deleteSession;
const createSession = (userId, userPermission) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.auditLog)(`Creating session for user: ${userId}`);
    // Create JWT token
    const token = yield (0, jwt_1.generateToken)({ userId }, process.env.SESSION_SECRET || "", process.env.SESSION_EXPIRY || "");
    (0, logger_1.auditLog)(`Generated JWT token for user: ${userId}`);
    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + Number(process.env.USER_SESSION_EXPIRY || "1"));
    (0, logger_1.auditLog)(`Session expiry set for user: ${userId} | Expires At: ${expiresAt}`);
    // Save session to DB
    let sessionObj = {
        userId,
        token,
        userPermission,
        expiresAt,
    };
    const sessionMongoObj = new mongodb_1.default(models_1.default.USER_SESSION);
    yield sessionMongoObj.create(sessionObj);
    (0, logger_1.auditLog)(`Session created successfully for user: ${userId} | Token: ${token}`);
    return {
        status: constant_1.default.RESPONSE_STATUS.SUCCESS,
        message: "Login successfully",
        token,
    };
});
exports.createSession = createSession;
const handleUserSession = (req, res, userSession) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, logger_1.auditLog)(`Starting process for handling user session for session ID: ${userSession._id}`);
        // 1. Get the user from userSession.userId
        const userMongoObj = new mongodb_1.default(models_1.default.SCHEMA.USER);
        const user = yield userMongoObj.findById(userSession.userId);
        if (!user) {
            (0, logger_1.auditLog)(`User with ID ${userSession.userId} not found`);
            return res.status(404).json({
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "User not found",
            });
        }
        (0, logger_1.auditLog)(`User with ID ${userSession.userId} found`);
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
        const userPermissions = yield (0, user_controller_1.getUserPermissions)(roleId);
        (0, logger_1.auditLog)(`Permissions for role ID ${roleId} fetched successfully`);
        // 3. Archive current session using userSession._id
        const sessionMongoObj = new mongodb_1.default(models_1.default.SCHEMA.USER_SESSION);
        const archiveResult = yield sessionMongoObj.deleteById(userSession._id);
        if (!archiveResult) {
            (0, logger_1.auditLog)(`Failed to archive session with ID ${userSession._id}`);
            return res.status(500).json({
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Failed to archive session",
            });
        }
        (0, logger_1.auditLog)(`Session with ID ${userSession._id} archived successfully`);
        // 4. Create new session using createSession function
        const newSession = yield createSession(userSession.userId, userPermissions);
        if (!newSession) {
            (0, logger_1.auditLog)(`Failed to create a new session for user ID ${userSession.userId}`);
            return res.status(500).json({
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Failed to create new session",
            });
        }
        (0, logger_1.auditLog)(`New session created successfully for user ID ${userSession.userId}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "User session handled successfully",
            newSession,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error handling user session: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Server error",
            code: 500,
        };
    }
});
exports.handleUserSession = handleUserSession;
//# sourceMappingURL=auth.js.map