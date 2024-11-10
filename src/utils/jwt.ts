import CONSTANT from "../constant/constant";
import { auditLog } from "./logger";

const jwt = require('jsonwebtoken');

const generateToken = async (data: object, secret: string, expiresIn: string) => {
    try {
        auditLog(`JWT Data ${data}`)
        const token = await jwt.sign(data, secret, { expiresIn });
        return token;
    } catch(error: any) {
        console.error(error.message);
        auditLog("Login error");
    }
}

const verifyToken = async (token: string, secret: string) => {
    try {
        const decoded = await jwt.verify( token, secret );
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            decoded
        };
    } catch(error: any) {
        console.error(error.message);
        auditLog(error);
        return {
            status: CONSTANT.RESPONSE_STATUS.SESSION_EXPIRE,
            message: error.message,
            reasonCode: CONSTANT.RESPONSE_CODE.SESSION_EXPIRE
        }
    }
}

export { generateToken , verifyToken}