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
exports.hashData = exports.checkHashData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptWrapper {
    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }
    // Hash a password
    hashPassword(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt_1.default.genSalt(this.saltRounds);
                const hashedPassword = yield bcrypt_1.default.hash(plainPassword, salt);
                return hashedPassword;
            }
            catch (error) {
                throw new Error("Error hashing password");
            }
        });
    }
    // Compare plain password with hashed password
    comparePassword(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isMatch = yield bcrypt_1.default.compare(plainPassword, hashedPassword);
                return isMatch;
            }
            catch (error) {
                throw new Error("Error comparing password");
            }
        });
    }
}
let hashData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new BcryptWrapper().hashPassword(data);
});
exports.hashData = hashData;
let checkHashData = (data, hashData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new BcryptWrapper().comparePassword(data, hashData);
});
exports.checkHashData = checkHashData;
exports.default = BcryptWrapper;
//# sourceMappingURL=bcrypt.js.map