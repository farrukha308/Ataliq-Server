import { NextFunction, Request, Response } from "express";
import { checkUserByObject, signinEmail, signupEmail, sendOTPEmail, resetPassword, unarchiveRequest, checkUserAccount, validateQuestionRetriveEmail } from "../controllers/user/user.controller";
import passport from "../controllers/user/googlePassport";
import session from "express-session";
import CONSTANT from "../../constant/constant";
import linkedinPassport from "../controllers/user/linkedinPassport";

const express = require("express");
const userRoutes = express.Router();

userRoutes.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || "",
  })
);

//! Login
userRoutes.post(
  "/loginEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await signinEmail(req, res);
    next(response);
  }
);

//! Signup with email
userRoutes.post(
  "/signupEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await signupEmail(req, res);
    next(response);
  }
);

//! User verify with email (reset password flow)
userRoutes.post(
  "/verifyEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await checkUserByObject({ email: req.body.email });
    next(response);
  }
);

//! Verify OTP and reset password (reset password flow)
userRoutes.post(
  "/validateOtp-resetPassword",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await resetPassword(req, res);
    next(response);
  }
);

//! User verify with firstname, lastName, DOB (forget email flow)
userRoutes.post(
  "/ForgetEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await checkUserAccount({
      dateOfBirth: req.body.dateOfBirth,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
    next(response);
  }
);

//! Validate Secret Answer (forget email flow)
userRoutes.post(
  "/validateQuestionRetriveEmail",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await validateQuestionRetriveEmail(req, res);
    next(response);
  }
);

//! Send OTP 
userRoutes.post(
  "/sendOTP",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await sendOTPEmail(req.body.email);
    next(response);
  }
);

//! Send Request for unarchive
userRoutes.post(
  "/requestForUnarchive",
  async (req: Request, res: Response, next: NextFunction) => {
    let response = await unarchiveRequest(req, res);
    next(response);
  }
);


if (process.env.GOOGLE_AUTH_ENABLE === 'Y') {
  userRoutes.use(passport.initialize());
  userRoutes.use(passport.session());

  //! Google Auth Start
  userRoutes.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  userRoutes.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req: Request, res: Response, next: NextFunction) => {
      // Successful authentication, redirect home or wherever
      res.cookie(CONSTANT.SESSION_COOKIE, req.user, {
        httpOnly: true, // Prevent access to cookie from JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax", // Helps prevent CSRF attacks
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.redirect(301, process.env.GOOGLE_AUTH_SUCCESS_REDIRECT || ""); // Adjust the redirect as needed
    }
  );

  userRoutes.get("/logout", (req: Request, res: Response, next: NextFunction) => {
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

  userRoutes.use(linkedinPassport.session());
  userRoutes.use(linkedinPassport.session());
  userRoutes.get("/auth/linkedin", linkedinPassport.authenticate("linkedin"));

  userRoutes.get(
    "/auth/linkedin/callback",
    linkedinPassport.authenticate("linkedin", { failureRedirect: "/" }),
    (req: Request, res: Response) => {
      res.cookie(CONSTANT.SESSION_COOKIE, req.user, {
        httpOnly: true, // Prevent access to cookie from JavaScript
        secure: process.env.server_env === "prod", // Use secure cookies in production
        sameSite: "lax", // Helps prevent CSRF attacks
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.redirect(301, process.env.GOOGLE_AUTH_SUCCESS_REDIRECT || "");
    }
  );

  //! Linkedin Auth End
}



export default userRoutes;
