import { Schema, model, Types, Document } from 'mongoose';
import CONSTANT from '../../../constant/constant';

// Interface for the secret question schema
interface IUserSecretQuestion extends Document {
    userId: Types.ObjectId;  // Reference to the user
    question: string;      // Secret question
    answer: string;        // Secret answer (Should be hashed)
    isArchive: boolean;
    createdAt: Date;       // Record creation date
    updatedAt: Date;       // Record update date
}

const userSecretQuestionSchema = new Schema<IUserSecretQuestion>({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: CONSTANT.SCHEMA.USER,  // Reference to the user model
        required: true 
    },
    question: { 
        type: String, 
        required: true 
    },
    answer: { 
        type: String, 
        required: true 
    },
    isArchive: { 
        type: Boolean, 
        default: false  // Default to 'N', indicating the record is not deleted
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields
});

const UserSecretQuestion = model<IUserSecretQuestion>(CONSTANT.SCHEMA.USER_SECRET_QUESTION, userSecretQuestionSchema);

export default UserSecretQuestion;
export { IUserSecretQuestion };
