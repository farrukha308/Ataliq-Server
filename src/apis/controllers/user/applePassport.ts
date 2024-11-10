import appleSigninAuth = require("apple-signin-auth");
import { auditLog } from "../../../utils/logger";
import MongooseWrapper from "../../../wrapper/mongodb";
import MODELS from "../../models";
import CONSTANT from "../../../constant/constant";
import { userDataType } from "../../models/users/user.model";
import { createUser, getUserPermissions } from "./user.controller";
import { createSession } from "../../../middlewares/auth";

interface appleUserObjType {
  iss: string; // Issuer Identifier
  aud: string; // Audience for which the token is intended
  exp: string; // Expiration time (UNIX timestamp)
  iat: string; // Issued at time (UNIX timestamp)
  sub: string; // Unique identifier for the user
  at_hash?: string; // Optional, access token hash
  email: string; // User's email, optional if the user has agreed to share
  email_verified?: 'true' | 'false' | boolean; // Whether the email is verified
  is_private_email?: 'true' | 'false' | boolean; // Whether the email is a private relay email
  auth_time?: number; // Time when the authentication occurred (UNIX timestamp)
  nonce_supported: boolean; // Whether a nonce is supported in the token
  name?: {
    // Optional, only available if the user has agreed to share their name
    firstName: string;
    lastName: string;
  };
}

const CLIENT_ID = process.env.APPLE_CLIENT_ID || ""; // Replace with your Service ID
const TEAM_ID = process.env.APPLE_TEAM_ID || ""; // Replace with your Team ID
const KEY_ID = process.env.APPLE_KEY_ID || ""; // Replace with your Key ID
const PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY || "";

const redirectUri = `${process.env.BASE_URL}api/v1/user/auth/apple/callback`;

const options = {
  clientID: CLIENT_ID, // Apple Client ID
  redirectUri: redirectUri,
  // OPTIONAL
  state: "state", // optional, An unguessable random string. It is primarily used to protect against CSRF attacks.
  scope: "email", // optional
};

const appleSigninAuthUrl = appleSigninAuth.getAuthorizationUrl(options);

const updateOrCreateAppleIdUser = async (USER_OBJ: appleUserObjType) => {
  let session = undefined;
  if (USER_OBJ) {
    auditLog("Apple Auth profile found.");
    let userObj = new MongooseWrapper<any>(MODELS[CONSTANT.SCHEMA.USER]);
    let user = await userObj.find({ email: USER_OBJ.email });

    let userCreateData = <userDataType>{
      email: USER_OBJ.email,
      firstName: USER_OBJ.name ? USER_OBJ.name.firstName : "",
      lastName: USER_OBJ.name ? USER_OBJ.name.lastName : "",
      appleAccessToken: USER_OBJ.sub,
    };

    if (!user && !user[0]) {
      let newUser = await createUser(1, userCreateData);
      const user = newUser[0];
      const roleId = user.appRole;

      const userPermissions = await getUserPermissions(roleId);
      
      session = await createSession(newUser._id, userPermissions);
      // return session
    } else {
      let updatedUser = await userObj.updateById(user[0]._id, userCreateData);
      
      const roleId = user[0].appRole;
      const userPermissions = await getUserPermissions(roleId);
      
      session = await createSession(updatedUser._id, userPermissions);
      // return session
    }
    return session;
  }
};

export {
  updateOrCreateAppleIdUser,
  appleSigninAuthUrl,
  appleSigninAuth,
  CLIENT_ID,
  TEAM_ID,
  KEY_ID,
  PRIVATE_KEY,
  redirectUri,
};
