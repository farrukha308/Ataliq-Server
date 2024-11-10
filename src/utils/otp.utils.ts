import MongooseWrapper from '../wrapper/mongodb';
import MODELS from '../apis/models';
import { IOTP } from '../apis/models/configs/otp.model';
import BcryptWrapper from '../wrapper/bcrypt';
import CONSTANT from '../constant/constant';
import { auditLog } from './logger';

// Function to generate a random OTP
const generateOTP = async (length: number = 6) => {
    const min = Math.pow(10, length - 1);  // Minimum number with the specified length
    const max = Math.pow(10, length) - 1;  // Maximum number with the specified length
    let otp: string = "";
    if (process.env.server_env === "dev")
        otp = "0";
    else
        otp = Math.floor(min + Math.random() * (max - min + 1)).toString();

    const encryptOTP = new BcryptWrapper();
    return { otpCode: await encryptOTP.hashPassword(otp), otp }
};

// Function to save OTP in the database
export const createOTP = async (email: string, expiredTime: string = process.env.OPT_EXPIRY || '10') => {
    let optObj = new MongooseWrapper(MODELS.OTP)
    const { otpCode, otp } = await generateOTP();
    const expiresAt = new Date(Date.now() + Number(expiredTime) * 60 * 1000); // OTP expires in 10 minutes

    // Create the OTP object
    const otpData = <IOTP>{
        email,
        expiresAt,
        otpCode,
    };

    await optObj.create(otpData);
    return otp;
};


export const verifyOTP = async (email: string, otpCode: string) => {
    try {
        auditLog(`Verifying OTP for email: ${email}`);

        let optObj = new MongooseWrapper(MODELS.OTP);
        const otp = <IOTP>await optObj.findOne({ email });

        if (!otp) {
            auditLog(`OTP verification failed: No OTP found for email: ${email}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: 'Invalid OTP',
                code: 400
            };
        }

        if (!await new BcryptWrapper().comparePassword(otpCode, otp?.otpCode)) {
            auditLog(`OTP verification failed: Wrong OTP for email: ${email}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: 'Wrong OTP',
                code: 400
            };
        }

        if (otp.expiresAt < new Date()) {
            auditLog(`OTP verification failed: OTP expired for email: ${email}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: 'OTP expired',
                code: 400
            };
        }

        if (otp.verified) {
            auditLog(`OTP verification failed: OTP already used for email: ${email}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: 'OTP already used',
                code: 400
            };
        }

        // Mark the OTP as verified
        let markotp = await optObj.updateById(otp._id as string, { verified: true } as Object);

        auditLog(`OTP verified successfully for email: ${email}`);
        return { 
            status: CONSTANT.RESPONSE_STATUS.SUCCESS, 
            message: 'OTP verified' 
        };
    } catch (error: any) {
        auditLog(`OTP verification failed due to server error for email: ${email}. Error: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: 'Server error, try again later',
            code: 500
        };
    }
};
