type ResponseDataType = string | number | boolean | object | null | undefined | Array<unknown>;

interface ResponseData {
  success: boolean;
  message?: string;
  data?: ResponseDataType;
}

interface ResponseResult {
  response: ResponseData;
  statusCode: number;
}

const createResponse = (success: boolean, data: ResponseDataType = null, message: string = '', statusCode: number = 200): ResponseResult => {
  const response: ResponseData = {
    success,
    ...(message && { message }),
    ...(data !== null && { data }),
  };
  return { response, statusCode };
};

export const successResponse = (data: ResponseDataType = null, message: string = 'Success', statusCode: number = 200): ResponseResult => {
  return createResponse(true, data, message, statusCode);
};

export const errorResponse = (message: string = 'Internal server error', statusCode: number = 500, data: ResponseDataType = null): ResponseResult => {
  return createResponse(false, data, message, statusCode);
};

export const validationErrorResponse = (message: string = 'Validation error', data: ResponseDataType = null): ResponseResult => {
  return createResponse(false, data, message, 400);
};

export const unauthorizedResponse = (message: string = 'Unauthorized'): ResponseResult => {
  return createResponse(false, null, message, 401);
};

export const forbiddenResponse = (message: string = 'Forbidden'): ResponseResult => {
  return createResponse(false, null, message, 403);
};

export const notFoundResponse = (message: string = 'Not found'): ResponseResult => {
  return createResponse(false, null, message, 404);
};

export { createResponse };
