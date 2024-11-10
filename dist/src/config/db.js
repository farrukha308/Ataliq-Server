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
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDbConnection = exports.initDB = void 0;
const logger_1 = require("../utils/logger");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uri = '';
        if (process.env.server_env == "dev" && process.env.MONGO_URI_DEV) {
            uri = process.env.MONGO_URI_DEV;
        }
        else if (process.env.server_env == "prod" && process.env.MONGO_URI_PROD) {
            uri = process.env.MONGO_URI_PROD;
        }
        yield mongoose.connect(uri, {
            dbName: process.env.DATABASE_NAME,
            serverSelectionTimeoutMS: 30000 // 30 seconds
        });
        console.log('database connected............', uri);
        return;
    }
    catch (error) {
        (0, logger_1.auditLog)("Database initialization failed.");
    }
});
exports.initDB = initDB;
const closeDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    // await mongoose.connection.close();
    // if (process.env.server_env == "dev") console.log("Connection to MongoDB closed");
});
exports.closeDbConnection = closeDbConnection;
mongoose.connection.on("error", (error) => {
    console.error(" Obs! There was an unexpected error connecting to the database.", error);
});
//# sourceMappingURL=db.js.map