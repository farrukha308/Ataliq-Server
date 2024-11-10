import bcrypt from 'bcrypt';

class BcryptWrapper {
    private saltRounds: number;

    constructor(saltRounds: number = 10) {
        this.saltRounds = saltRounds;
    }

    // Hash a password
    async hashPassword(plainPassword: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(this.saltRounds);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);
            return hashedPassword;
        } catch (error) {
            throw new Error("Error hashing password");
        }
    }

    // Compare plain password with hashed password
    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch;
        } catch (error) {
            throw new Error("Error comparing password");
        }
    }
}

let hashData = async (data: any) => {
    return await new BcryptWrapper().hashPassword(data)
}

let checkHashData = async (data: any, hashData: any) => {
    return await new BcryptWrapper().comparePassword(data, hashData)
}

export default BcryptWrapper;
export {
    checkHashData,
    hashData
}
