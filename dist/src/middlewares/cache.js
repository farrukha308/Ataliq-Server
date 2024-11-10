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
exports.getUserSession = exports.setUserSession = exports.getCache = exports.setCache = exports.initiateCache = void 0;
const logger_1 = require("../utils/logger");
const mongodb_1 = __importDefault(require("../wrapper/mongodb"));
const models_1 = __importDefault(require("../apis/models"));
const db_1 = require("../config/db");
const regex_1 = require("../utils/regex");
const NodeCache = require("node-cache");
const localNodeCache = new NodeCache({ stdTTL: process.env.LOCAL_CACHE_TTL || 86400 });
const redis = require("redis");
let redisClient;
const initiateCache = () => {
    try {
        (0, logger_1.auditLog)(`Initiating cache system...`);
        if (isCacheEnable() && process.env.IS_REDIS_ENABLE === "Y") {
            redisClient = redis.createClient({
                host: process.env.RADIS_HOST,
                port: process.env.RADIS_PORT,
            });
            redisClient.connect();
            redisClient.on("connect", () => {
                (0, logger_1.auditLog)("REDIS is connected.");
                console.log("REDIS IS CONNECTED");
                loadCache();
            });
            redisClient.on("error", (error) => {
                (0, logger_1.auditLog)(`REDIS ERROR: ${error}`);
                console.log("REDIS ERROR", error);
            });
        }
        else if (isCacheEnable() &&
            process.env.IS_LOCAL_NODE_CACHE_ENABLE === "Y") {
            (0, logger_1.auditLog)(`Cache Loading using local node cache...`);
            loadCache();
        }
    }
    catch (error) {
        (0, logger_1.auditLog)(`REDIS ERROR: ${error}`);
        console.error(`Error in initiateCache: ${error}`);
    }
};
exports.initiateCache = initiateCache;
const loadCache = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.auditLog)(`Start Loading Cache...`);
    const cacheList = new mongodb_1.default(models_1.default.CACHE_LIST);
    let data = yield cacheList.loadCache();
    yield Promise.all(data === null || data === void 0 ? void 0 : data.map((cache) => __awaiter(void 0, void 0, void 0, function* () {
        let schemaName = cache.CACHE_SCHEMA_NAME;
        let cacheData = new mongodb_1.default(models_1.default[schemaName]);
        let data = yield cacheData.loadCache();
        yield setCache(schemaName, data);
        (0, logger_1.auditLog)(`Cache loaded for schema: ${schemaName}`);
    })));
    (0, db_1.closeDbConnection)();
    (0, logger_1.auditLog)(`Cache loaded successfully.`);
});
//!
//? Set all type of cache data
//? Expiry time is none
//!
const setCache = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, logger_1.auditLog)(`Setting cache for key: ${key}`);
        if (process.env.IS_REDIS_ENABLE === "Y") {
            if (!redisClient)
                (0, logger_1.auditLog)("Redis client not initialized");
            yield redisClient.set(key.toString(), JSON.stringify(value));
        }
        else if (process.env.IS_LOCAL_NODE_CACHE_ENABLE === "Y") {
            localNodeCache.set(key, value);
        }
        (0, logger_1.auditLog)(`Cache set for key: ${key}`);
    }
    catch (error) {
        (0, logger_1.auditLog)(`setCache ERROR for key ${key}: ${error}`);
    }
});
exports.setCache = setCache;
//!
// Get all type of cache data
//!
const getCache = (KEY) => __awaiter(void 0, void 0, void 0, function* () {
    let data = null;
    try {
        (0, logger_1.auditLog)(`Fetching cache for key: ${KEY}`);
        if (process.env.IS_REDIS_ENABLE === "Y") {
            data = yield redisClient.get(KEY);
            if (data === null) {
                (0, logger_1.auditLog)(`Cache miss for key: ${KEY}, loading cache...`);
                yield loadCache();
                data = yield redisClient.get(KEY);
            }
        }
        else if (process.env.IS_LOCAL_NODE_CACHE_ENABLE === "Y") {
            if ((0, regex_1.isEmptyObject)(localNodeCache.data)) {
                (0, logger_1.auditLog)(`Local cache empty, loading cache...`);
                yield loadCache();
                data = yield localNodeCache.get(KEY);
            }
            else {
                (0, logger_1.auditLog)(`Fetching from local cache for key: ${KEY}`);
                data = yield localNodeCache.get(KEY);
            }
        }
        (0, logger_1.auditLog)(`Cache fetched for key: ${KEY}`);
        return data;
    }
    catch (error) {
        (0, logger_1.auditLog)(`getCache ERROR for key ${KEY}: ${error}`);
        return;
    }
});
exports.getCache = getCache;
const setUserSession = (userId, sessionData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, logger_1.auditLog)(`Setting session for user: ${userId}`);
        if (!redisClient)
            (0, logger_1.auditLog)("Redis client not initialized");
        // Set the hash fields for the user session
        yield redisClient.hSet(`USER_SESSION:${userId}`, sessionData);
        // Set the expiration time for the session key
        const expiry = parseInt(process.env.USER_SESSION_EXPIRY || "3600", 10);
        yield redisClient.expire(`USER_SESSION:${userId}`, expiry);
        (0, logger_1.auditLog)(`Session set for user: ${userId}`);
    }
    catch (error) {
        (0, logger_1.auditLog)(`setUserSession ERROR for user ${userId}: ${error}`);
    }
});
exports.setUserSession = setUserSession;
const getUserSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.auditLog)(`Fetching session for user: ${userId}`);
    if (!redisClient)
        (0, logger_1.auditLog)("Redis client not initialized");
    const sessionData = yield redisClient.hGetAll(`USER_SESSION:${userId}`);
    (0, logger_1.auditLog)(`Session fetched for user: ${userId}`);
    return sessionData;
});
exports.getUserSession = getUserSession;
const isCacheEnable = () => {
    if (process.env.IS_CACHE_ENABLE === "N") {
        (0, logger_1.auditLog)("Cache is disabled in environment variables.");
        console.log("Cache Error: Please Enable Cache from env.");
        return false;
    }
    else {
        (0, logger_1.auditLog)("Cache is enabled.");
        return true;
    }
};
//# sourceMappingURL=cache.js.map