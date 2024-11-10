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
const user_controller_1 = require("../controllers/user/user.controller");
const googlePassport_1 = __importDefault(require("../controllers/user/googlePassport"));
const express_session_1 = __importDefault(require("express-session"));
const constant_1 = __importDefault(require("../../constant/constant"));
const linkedinPassport_1 = __importDefault(require("../controllers/user/linkedinPassport"));
const express = require("express");
const userRoutes = express.Router();
userRoutes.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || "",
}));
//! Login
userRoutes.post("/loginEmail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.signinEmail)(req, res);
    next(response);
}));
//! Signup with email
userRoutes.post("/signupEmail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.signupEmail)(req, res);
    next(response);
}));
//! User verify with email (reset password flow)
userRoutes.post("/verifyEmail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.checkUserByObject)({ email: req.body.email });
    next(response);
}));
//! Verify OTP and reset password (reset password flow)
userRoutes.post("/validateOtp-resetPassword", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.resetPassword)(req, res);
    next(response);
}));
//! User verify with firstname, lastName, DOB (forget email flow)
userRoutes.post("/ForgetEmail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.checkUserAccount)({
        dateOfBirth: req.body.dateOfBirth,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    next(response);
}));
//! Validate Secret Answer (forget email flow)
userRoutes.post("/validateQuestionRetriveEmail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.validateQuestionRetriveEmail)(req, res);
    next(response);
}));
//! Send OTP 
userRoutes.post("/sendOTP", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.sendOTPEmail)(req.body.email);
    next(response);
}));
//! Send Request for unarchive
userRoutes.post("/requestForUnarchive", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, user_controller_1.unarchiveRequest)(req, res);
    next(response);
}));
if (process.env.GOOGLE_AUTH_ENABLE === 'Y') {
    userRoutes.use(googlePassport_1.default.initialize());
    userRoutes.use(googlePassport_1.default.session());
    //! Google Auth Start
    userRoutes.get("/auth/google", googlePassport_1.default.authenticate("google", {
        scope: ["profile", "email"],
    }));
    userRoutes.get("/auth/google/callback", googlePassport_1.default.authenticate("google"), (req, res, next) => {
        // Successful authentication, redirect home or wherever
        res.cookie(constant_1.default.SESSION_COOKIE, req.user, {
            httpOnly: true, // Prevent access to cookie from JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "lax", // Helps prevent CSRF attacks
            maxAge: 3600000, // 1 hour in milliseconds
        });
        res.redirect(301, process.env.GOOGLE_AUTH_SUCCESS_REDIRECT || ""); // Adjust the redirect as needed
    });
    userRoutes.get("/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).send("Failed to logout.");
            }
            next();
        });
    });
    //! Google Auth End
}
if (process.env.LINKEDIN_AUTH_ENABLE === 'Y') {
    //! Linkedin Auth Start
    userRoutes.use(linkedinPassport_1.default.session());
    userRoutes.use(linkedinPassport_1.default.session());
    userRoutes.get("/auth/linkedin", linkedinPassport_1.default.authenticate("linkedin"));
    userRoutes.get("/auth/linkedin/callback", linkedinPassport_1.default.authenticate("linkedin", { failureRedirect: "/" }), (req, res) => {
        res.cookie(constant_1.default.SESSION_COOKIE, req.user, {
            httpOnly: true, // Prevent access to cookie from JavaScript
            secure: process.env.server_env === "prod", // Use secure cookies in production
            sameSite: "lax", // Helps prevent CSRF attacks
            maxAge: 3600000, // 1 hour in milliseconds
        });
        res.redirect(301, process.env.GOOGLE_AUTH_SUCCESS_REDIRECT || "");
    });
    //! Linkedin Auth End
}
exports.default = userRoutes;
//# sourceMappingURL=user.routes.js.map