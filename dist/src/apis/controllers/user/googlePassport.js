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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const mongodb_1 = __importDefault(require("../../../wrapper/mongodb"));
const models_1 = __importDefault(require("../../models"));
const constant_1 = __importDefault(require("../../../constant/constant"));
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../../middlewares/auth");
const logger_1 = require("../../../utils/logger");
require("dotenv").config();
if (process.env.GOOGLE_AUTH_ENABLE === 'Y') {
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.deserializeUser((user, done) => {
        done(null, user);
    });
    // Configure Passport for Google OAuth
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID || "", // Replace with your Client ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", // Replace with your Client Secret
        callbackURL: `${process.env.BASE_URL}api/v1/user/auth/google/callback`,
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
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
    })));
}
exports.default = passport_1.default;
//# sourceMappingURL=googlePassport.js.map