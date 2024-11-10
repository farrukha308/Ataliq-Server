import { Request, Response, NextFunction } from "express";
import { auditLog } from "../utils/logger";
import { getCache } from "./cache";
import CONSTANT from "../constant/constant";
import { getRouteName } from "../utils/helper";

interface ValidationResult {
  isValid: boolean;
  missingParams: string[];
}

interface ValidationResultResponse {
  status: string;
  message: string;
  details?: string;
  missingParams?: string[];
  responseCode: number
}

const validateRequest = async function (
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    auditLog(`Running validateRequest middleware for route: ${req.originalUrl}`);

    let validators: any = await getCache(CONSTANT.CACHE.REQUEST_VALIDATOR);
    let validator: any;

    if (validators) {
      if (process.env.IS_REDIS_ENABLE === "Y") validators = JSON.parse(validators);

      let route = getRouteName(req.originalUrl)

      validator = validators?.filter(
        (validator: any) =>
          validator.VALIDATOR_ROUTE_URL === route
      );

      if (validator.length > 0) {
        auditLog(`Validator found for route: ${req.originalUrl}`);
        validator = validator[0]?.VALIDATOR_FIELDES;
      } else {
        auditLog(`No specific validator found for route: ${req.originalUrl}`);
        validator = [];
      }
    } else {
      auditLog(`No validators found in cache for route: ${req.originalUrl}`);
      validator = [];
    }

    let response = validateAndHandleRequest(req, res, validator);

    if (response.status === CONSTANT.RESPONSE_STATUS.SUCCESS) {
      auditLog(`Request validation passed for route: ${req.originalUrl}`);
      next();
    } else {
      auditLog(`Validation error: ${JSON.stringify(response)} for route: ${req.originalUrl}`);
      res.status(400).json(response);
    }
  } catch (error: any) {
    auditLog(`Error in validateRequest: ${error.message}`);
    console.error(error.message);
    return res.status(401).send(error.message);
  }
};

function validateRequestBody(
  body: Record<string, any>,
  requiredParams: string[]
): ValidationResult {
  const missingParams = requiredParams.filter((param) => !(
    (param in body) &&
    body[param] !== "" &&
    body[param] !== null));

  if (missingParams.length > 0) {
    auditLog(`Missing required parameters: ${missingParams.join(", ")}`);
  } else {
    auditLog(`All required parameters present: ${requiredParams.join(", ")}`);
  }

  return {
    isValid: missingParams.length === 0,
    missingParams,
  };
}

function validateAndHandleRequest(
  req: Request,
  res: Response,
  requiredParams: string[]
): ValidationResultResponse {
  if (requiredParams.length === 0) {
    auditLog(`No required parameters for route: ${req.originalUrl}`);
    return { status: CONSTANT.RESPONSE_STATUS.SUCCESS, message: "No required params", responseCode: 0 };
  }

  if (!req.body) {
    auditLog(`Request body is empty for route: ${req.originalUrl}`);
    return {
      status: "error",
      message: "Bad Request",
      details: "Request body is empty",
      responseCode: -1
    };
  }

  const validationResult = validateRequestBody(req.body, requiredParams);
  if (!validationResult.isValid) {
    auditLog(`Validation failed. Missing parameters: ${validationResult.missingParams.join(", ")}`);
    return {
      status: "error",
      message: "Bad Request",
      missingParams: validationResult.missingParams,
      details: `The following required parameters are missing: ${validationResult.missingParams.join(", ")}`,
      responseCode: -1
    };
  }

  auditLog(`Request body is valid for route: ${req.originalUrl}`);
  return {
    status: CONSTANT.RESPONSE_STATUS.SUCCESS,
    message: "Request body is valid!",
    responseCode: 0
  };
}


export default validateRequest;
