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
exports.redirectUri = exports.PRIVATE_KEY = exports.KEY_ID = exports.TEAM_ID = exports.CLIENT_ID = exports.appleSigninAuth = exports.appleSigninAuthUrl = exports.updateOrCreateAppleIdUser = void 0;
const appleSigninAuth = require("apple-signin-auth");
exports.appleSigninAuth = appleSigninAuth;
const logger_1 = require("../../../utils/logger");
const mongodb_1 = __importDefault(require("../../../wrapper/mongodb"));
const models_1 = __importDefault(require("../../models"));
const constant_1 = __importDefault(require("../../../constant/constant"));
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../../middlewares/auth");
const CLIENT_ID = process.env.APPLE_CLIENT_ID || ""; // Replace with your Service ID
exports.CLIENT_ID = CLIENT_ID;
const TEAM_ID = process.env.APPLE_TEAM_ID || ""; // Replace with your Team ID
exports.TEAM_ID = TEAM_ID;
const KEY_ID = process.env.APPLE_KEY_ID || ""; // Replace with your Key ID
exports.KEY_ID = KEY_ID;
const PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY || "";
exports.PRIVATE_KEY = PRIVATE_KEY;
const redirectUri = `${process.env.BASE_URL}api/v1/user/auth/apple/callback`;
exports.redirectUri = redirectUri;
const options = {
    clientID: CLIENT_ID, // Apple Client ID
    redirectUri: redirectUri,
    // OPTIONAL
    state: "state", // optional, An unguessable random string. It is primarily used to protect against CSRF attacks.
    scope: "email", // optional
};
const appleSigninAuthUrl = appleSigninAuth.getAuthorizationUrl(options);
exports.appleSigninAuthUrl = appleSigninAuthUrl;
const updateOrCreateAppleIdUser = (USER_OBJ) => __awaiter(void 0, void 0, void 0, function* () {
    let session = undefined;
    if (USER_OBJ) {
        (0, logger_1.auditLog)("Apple Auth profile found.");
        let userObj = new mongodb_1.default(models_1.default[constant_1.default.SCHEMA.USER]);
        let user = yield userObj.find({ email: USER_OBJ.email });
        let userCreateData = {
            email: USER_OBJ.email,
            firstName: USER_OBJ.name ? USER_OBJ.name.firstName : "",
            lastName: USER_OBJ.name ? USER_OBJ.name.lastName : "",
            appleAccessToken: USER_OBJ.sub,
        };
        if (!user && !user[0]) {
            let newUser = yield (0, user_controller_1.createUser)(1, userCreateData);
            const user = newUser[0];
            const roleId = user.appRole;
            const userPermissions = yield (0, user_controller_1.getUserPermissions)(roleId);
            session = yield (0, auth_1.createSession)(newUser._id, userPermissions);
            // return session
        }
        else {
            let updatedUser = yield userObj.updateById(user[0]._id, userCreateData);
            const roleId = user[0].appRole;
            const userPermissions = yield (0, user_controller_1.getUserPermissions)(roleId);
            session = yield (0, auth_1.createSession)(updatedUser._id, userPermissions);
            // return session
        }
        return session;
    }
});
exports.updateOrCreateAppleIdUser = updateOrCreateAppleIdUser;
//# sourceMappingURL=applePassport.js.map