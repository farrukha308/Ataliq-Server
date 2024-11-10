import express, { Request, Response, NextFunction } from "express";
import { auditLog } from "../utils/logger";
import CONSTANT from "../constant/constant";

const ResponseHandler = async function (
  data: Error | any,
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    auditLog(`ResponseHandler called. Data received: ${JSON.stringify(data)}`);

    if (data?.status === CONSTANT.RESPONSE_STATUS.SUCCESS) {
      auditLog(`Handling Success response.`);
      SuccessHandler(data, req, res);
    } else if (data?.status === CONSTANT.RESPONSE_STATUS.FAIL) {
      auditLog(`Handling Error response.`);
      ErrorHandler(data, req, res);
    } else {
      auditLog(`Unauthorized access attempt detected.`);
      return res.status(401).send("Unauthorized access");
    }

  } catch (error: any) {
    auditLog(`Error in ResponseHandler: ${error.message}`);
    console.error(error.message);
    return res.status(401).send("Unauthorized access");
  }
};


const ErrorHandler = (err: Error | any, req: Request | any, res: Response) => {
  auditLog(`Error encountered: ${err.message || err}`);
  console.log("LOG 6 ", err);
  
  res.status(err.code ? err.code : 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.server_env === "dev" ? err : {}, // Only send stack trace in development
    responseCode: -1
  });
};


const SuccessHandler = (
  data: any,
  req: Request | any,
  res: Response,
) => {
  auditLog(`Success Response: ${JSON.stringify(data)}`);
  res.status(200).json({
    ...data,
    responseCode: 0
  });
};

export { ResponseHandler };
