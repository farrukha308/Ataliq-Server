import passport from "passport";
import { Profile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import MongooseWrapper from "../../../wrapper/mongodb";
import MODELS from "../../models";
import CONSTANT from "../../../constant/constant";
import { createUser, getUserPermissions } from "./user.controller";
import { generateToken } from "../../../utils/jwt";
import { createSession } from "../../../middlewares/auth";
import { auditLog } from "../../../utils/logger";
import { userDataType } from "../../models/users/user.model";
require("dotenv").config();

if (process.env.GOOGLE_AUTH_ENABLE === 'Y') {

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Configure Passport for Google OAuth
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "", // Replace with your Client ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", // Replace with your Client Secret
        callbackURL: `${process.env.BASE_URL}api/v1/user/auth/google/callback`,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Function
      ) => {
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
        }

        else {
          auditLog("Google Auth profile not found.")
          throw new Error("Google Auth profile not found.")
        }
      }
    )
  );
}

export default passport;
