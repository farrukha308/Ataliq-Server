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
const mongodb_1 = __importDefault(require("../../../wrapper/mongodb"));
const models_1 = __importDefault(require("../../models"));
const constant_1 = __importDefault(require("../../../constant/constant"));
const linkedinPassport = require("passport");
const logger_1 = require("../../../utils/logger");
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../../middlewares/auth");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
// Passport configuration
if (process.env.LINKEDIN_AUTH_ENABLE === 'Y') {
    linkedinPassport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/api/v1/user/auth/linkedin/callback",
        scope: ["openid", "email", "profile"],
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("LINKEDIN AUTH ", profile);
            // Handle user profile and save it to your database if needed
            let session = undefined;
            if (profile &&
                profile.emails &&
                profile.emails[0].value &&
                profile.name) {
                (0, logger_1.auditLog)("Google Auth profile found.");
                let userObj = new mongodb_1.default(models_1.default[constant_1.default.SCHEMA.USER]);
                let user = yield userObj.find({ email: profile.emails[0].value });
                let userCreateData = {
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    googleAccessToken: accessToken || "",
                    googleRefreshToken: refreshToken || "",
                };
                if (user.length === 0) {
                    let newUser = yield (0, user_controller_1.createUser)(1, userCreateData);
                    const user = newUser[0];
                    const roleId = user.appRole;
                    const userPermissions = yield (0, user_controller_1.getUserPermissions)(roleId);
                    session = yield (0, auth_1.createSession)(newUser._id, userPermissions);
                    // return session
                }
                else {
                    console.log("LLLL 1 ", user);
                    let updatedUser = yield userObj.updateById(user[0]._id, userCreateData);
                    const roleId = user[0].appRole;
                    const userPermissions = yield (0, user_controller_1.getUserPermissions)(roleId);
                    session = yield (0, auth_1.createSession)(updatedUser._id, userPermissions);
                    // return session
                }
                return done(null, session);
            }
            else {
                (0, logger_1.auditLog)("Google Auth profile not found.");
                throw new Error("Google Auth profile not found.");
            }
        }
        catch (err) {
            done(err, null);
        }
    })));
    linkedinPassport.serializeUser((user, done) => {
        done(null, user);
    });
    linkedinPassport.deserializeUser((user, done) => {
        done(null, user);
    });
}
exports.default = linkedinPassport;
//# sourceMappingURL=linkedinPassport.js.map