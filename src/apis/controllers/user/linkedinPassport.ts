import { Profile } from "passport";
import MongooseWrapper from "../../../wrapper/mongodb";
import MODELS from "../../models";
import CONSTANT from "../../../constant/constant";

import linkedinPassport = require("passport");
import { auditLog } from "../../../utils/logger";
import { createUser, getUserPermissions } from "./user.controller";
import { createSession } from "../../../middlewares/auth";
import { userDataType } from "../../models/users/user.model";
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

// Passport configuration

if (process.env.LINKEDIN_AUTH_ENABLE === 'Y') {
  linkedinPassport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/api/v1/user/auth/linkedin/callback",
        scope: ["openid", "email", "profile"],
      },

      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Function
      ) => {
        try {
          console.log("LINKEDIN AUTH ", profile);

          // Handle user profile and save it to your database if needed
          let session = undefined;
          if (
            profile &&
            profile.emails &&
            profile.emails[0].value &&
            profile.name
          ) {
            auditLog("Google Auth profile found.");
            let userObj = new MongooseWrapper<any>(MODELS[CONSTANT.SCHEMA.USER]);
            let user = await userObj.find({ email: profile.emails[0].value });

            let userCreateData = <userDataType>{
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              googleAccessToken: accessToken || "",
              googleRefreshToken: refreshToken || "",
            };

            if (user.length === 0) {
              let newUser = await createUser(1, userCreateData);

              const user = newUser[0];
              const roleId = user.appRole;
              const userPermissions = await getUserPermissions(roleId);

              session = await createSession(newUser._id, userPermissions);
              // return session
            } else {
              console.log("LLLL 1 ", user);
              let updatedUser = await userObj.updateById(
                user[0]._id,
                userCreateData
              );

              const roleId = user[0].appRole;
              const userPermissions = await getUserPermissions(roleId);

              session = await createSession(updatedUser._id, userPermissions);
              // return session
            }
            return done(null, session);
          } else {
            auditLog("Google Auth profile not found.");
            throw new Error("Google Auth profile not found.");
          }

        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  linkedinPassport.serializeUser((user: any, done: Function) => {
    done(null, user);
  });

  linkedinPassport.deserializeUser((user: any, done: Function) => {
    done(null, user);
  });
}

export default linkedinPassport;
