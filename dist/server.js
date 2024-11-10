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
const db_1 = require("./src/config/db");
const app = require('./src/config/app');
require('dotenv').config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.server_env) {
            process.env.server_env = "dev";
        }
        console.log("server environment............" + process.env.server_env);
        (0, db_1.initDB)();
        app.listen(process.env.PORT, () => {
            console.log('Server is listening', process.env.server_env);
        });
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=server.js.map