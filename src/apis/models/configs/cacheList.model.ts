import mongoose, { Document, Schema } from 'mongoose';
import CONSTANT from '../../../constant/constant';

interface ICache extends Document {
    CACHE_NAME: string;
    CACHE_SCHEMA_NAME: string;
    createdAt: Date;
    createdBy: string;
    isArchive: boolean;
}

const cacheSchema = new Schema<ICache>({
    CACHE_NAME: {
        type: String,
        required: true,
        unique: true
    },
    CACHE_SCHEMA_NAME: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String,
        required: true,
        default: 'SCRIPT'
    },
    isArchive: {
        type: Boolean,
        default: false
    },
});

const CacheList = mongoose.model<ICache>(CONSTANT.SCHEMA.CACHE_LIST, cacheSchema);

export default CacheList;

//! Script Structure
// {
//     "data1": "qwejdfklsf1",
//     "schema": "CACHE_LIST",
//       "data2": [{
//           "CACHE_NAME": "emailTemplate",
//           "CACHE_SCHEMA_NAME": "EMAIL_TEMPLATE"
//       },
//       {
//           "CACHE_NAME": "appRequests",
//           "CACHE_SCHEMA_NAME": "APP_REQUEST"
//       }]
//   }