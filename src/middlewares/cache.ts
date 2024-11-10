import { RedisClientType } from "redis";
import { auditLog } from "../utils/logger";
import MongooseWrapper from "../wrapper/mongodb";
import CONSTANT from "../constant/constant";
import appConfig from "../apis/models/configs/appConfig.model";
import MODELS from "../apis/models";
import { closeDbConnection } from "../config/db";
import { isEmptyObject } from "../utils/regex";
const NodeCache = require("node-cache");

const localNodeCache = new NodeCache({ stdTTL: process.env.LOCAL_CACHE_TTL || 86400 });
const redis = require("redis");

let redisClient: RedisClientType;

const initiateCache = () => {
  try {
    auditLog(`Initiating cache system...`);

    if (isCacheEnable() && process.env.IS_REDIS_ENABLE === "Y") {
      redisClient = redis.createClient({
        host: process.env.RADIS_HOST,
        port: process.env.RADIS_PORT,
      });

      redisClient.connect();
      redisClient.on("connect", () => {
        auditLog("REDIS is connected.");
        console.log("REDIS IS CONNECTED");
        loadCache();
      });

      redisClient.on("error", (error: any) => {
        auditLog(`REDIS ERROR: ${error}`);
        console.log("REDIS ERROR", error);
      });
    } else if (
      isCacheEnable() &&
      process.env.IS_LOCAL_NODE_CACHE_ENABLE === "Y"
    ) {
      auditLog(`Cache Loading using local node cache...`);
      loadCache();
    }
  } catch (error: any) {
    auditLog(`REDIS ERROR: ${error}`);
    console.error(`Error in initiateCache: ${error}`);
  }
};

const loadCache = async () => {
  auditLog(`Start Loading Cache...`);

  const cacheList = new MongooseWrapper<any>(MODELS.CACHE_LIST);
  let data = await cacheList.loadCache();

  await Promise.all(
    data?.map(async (cache) => {
      let schemaName = cache.CACHE_SCHEMA_NAME;
      let cacheData = new MongooseWrapper<any>(MODELS[schemaName]);
      let data = await cacheData.loadCache();
      await setCache(schemaName, data);
      auditLog(`Cache loaded for schema: ${schemaName}`);
    })
  );

  closeDbConnection();
  auditLog(`Cache loaded successfully.`);
};


//!
//? Set all type of cache data
//? Expiry time is none
//!

const setCache = async (
  key: string | number,
  value: string | number | object
): Promise<void> => {
  try {
    auditLog(`Setting cache for key: ${key}`);

    if (process.env.IS_REDIS_ENABLE === "Y") {
      if (!redisClient) auditLog("Redis client not initialized");
      await redisClient.set(key.toString(), JSON.stringify(value));
    } else if (process.env.IS_LOCAL_NODE_CACHE_ENABLE === "Y") {
      localNodeCache.set(key, value);
    }

    auditLog(`Cache set for key: ${key}`);
  } catch (error: any) {
    auditLog(`setCache ERROR for key ${key}: ${error}`);
  }
};

//!
// Get all type of cache data
//!
const getCache = async (KEY: string) => {
  let data = null;
  try {
    auditLog(`Fetching cache for key: ${KEY}`);

    if (process.env.IS_REDIS_ENABLE === "Y") {
      data = await redisClient.get(KEY);
      if (data === null) {
        auditLog(`Cache miss for key: ${KEY}, loading cache...`);
        await loadCache();
        data = await redisClient.get(KEY);
      }
    } else if (process.env.IS_LOCAL_NODE_CACHE_ENABLE === "Y") {
      if (isEmptyObject(localNodeCache.data)) {
        auditLog(`Local cache empty, loading cache...`);
        await loadCache();
        data = await localNodeCache.get(KEY);
      } else {
        auditLog(`Fetching from local cache for key: ${KEY}`);
        data = await localNodeCache.get(KEY);
      }
    }

    auditLog(`Cache fetched for key: ${KEY}`);
    return data;
  } catch (error: any) {
    auditLog(`getCache ERROR for key ${KEY}: ${error}`);
    return;
  }
};

const setUserSession = async (
  userId: string,
  sessionData: Record<string, string | number>
): Promise<void> => {
  try {
    auditLog(`Setting session for user: ${userId}`);

    if (!redisClient) auditLog("Redis client not initialized");

    // Set the hash fields for the user session
    await redisClient.hSet(`USER_SESSION:${userId}`, sessionData);

    // Set the expiration time for the session key
    const expiry = parseInt(process.env.USER_SESSION_EXPIRY || "3600", 10);
    await redisClient.expire(`USER_SESSION:${userId}`, expiry);

    auditLog(`Session set for user: ${userId}`);
  } catch (error: any) {
    auditLog(`setUserSession ERROR for user ${userId}: ${error}`);
  }
};

const getUserSession = async (
  userId: string
): Promise<Record<string, string>> => {
  auditLog(`Fetching session for user: ${userId}`);

  if (!redisClient) auditLog("Redis client not initialized");

  const sessionData = await redisClient.hGetAll(`USER_SESSION:${userId}`);

  auditLog(`Session fetched for user: ${userId}`);
  return sessionData;
};

const isCacheEnable = () => {
  if (process.env.IS_CACHE_ENABLE === "N") {
    auditLog("Cache is disabled in environment variables.");
    console.log("Cache Error: Please Enable Cache from env.");
    return false;
  } else {
    auditLog("Cache is enabled.");
    return true;
  }
};


export { initiateCache, setCache, getCache, setUserSession, getUserSession };
