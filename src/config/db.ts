import { auditLog } from "../utils/logger";

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const initDB = async () => {
    try {
        let uri: string = '';
        if (process.env.server_env == "dev" && process.env.MONGO_URI_DEV) {
            uri = process.env.MONGO_URI_DEV;
        } else if (process.env.server_env == "prod" && process.env.MONGO_URI_PROD) {
            uri = process.env.MONGO_URI_PROD;
        }

        await mongoose.connect(uri, {
            dbName: process.env.DATABASE_NAME,
            serverSelectionTimeoutMS: 30000 // 30 seconds
        });
        console.log('database connected............',uri);


        return;
    } catch (error) {
        auditLog("Database initialization failed.");
    }
}


const closeDbConnection = async () => {
    // await mongoose.connection.close();
    // if (process.env.server_env == "dev") console.log("Connection to MongoDB closed");
}


mongoose.connection.on("error", (error: any) => {
    console.error(" Obs! There was an unexpected error connecting to the database.", error);
});

export {
    initDB,
    closeDbConnection
}