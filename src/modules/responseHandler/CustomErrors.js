import StatusCodes from './StatusCodes';

const CustomErrors = {
  BAD_REQUEST: {
    statusCode: StatusCodes.BAD_REQUEST,
    errorCode: 'BAD_REQUEST',
    message: 'Bad request',
  },
  USER_NOT_AUTHORIZED: {
    statusCode: StatusCodes.FORBIDDEN,
    errorCode: 'USER_NOT_AUTHORIZED',
    message: 'Not authorized',
  },
  USER_NOT_AUTHENTICATED: {
    statusCode: StatusCodes.UNAUTHENTICATED,
    errorCode: 'USER_NOT_AUTHENTICATED',
    message: 'User not authenticated',
  },
  USER_ALREADY_EXISTS: {
    statusCode: StatusCodes.CONFLICT,
    errorCode: 'USER_ALREADY_EXISTS',
    message: 'User already exists',
  },
  USER_NOT_VALID: {
    statusCode: StatusCodes.UNPROCESSABLE,
    errorCode: 'USER_NOT_VALID',
    message: 'User data is not valid',
  },
  DOES_NOT_EXIST: {
    statusCode: StatusCodes.UNPROCESSABLE,
    errorCode: 'DOES_NOT_EXIST',
    message: 'Entity does not exist!',
  },
  INVALID_REQUEST: {
    statusCode: StatusCodes.UNPROCESSABLE,
    errorCode: 'INVALID_REQUEST',
    message: 'Invalid request',
  },
  USER_REQUEST_TOO_OFTEN: {
    statusCode: StatusCodes.UNPROCESSABLE,
    errorCode: 'USER_REQUEST_TOO_OFTEN',
    message: 'Request already received',
  },
  USER_NOT_VERIFIED: {
    statusCode: StatusCodes.BAD_REQUEST,
    errorCode: 'USER_NOT_VERIFIED',
    message: 'User email is not verified',
  },
  USER_NOT_ALLOWED: {
    statusCode: StatusCodes.UNPROCESSABLE,
    errorCode: 'USER_NOT_ALLOWED',
    message: 'User is not allowed',
  },
  USER_WRONG_LOGIN_CREDENTIALS: {
    statusCode: StatusCodes.BAD_REQUEST,
    errorCode: 'USER_WRONG_LOGIN_CREDENTIALS',
    message: 'User email or password wrong!',
  },
  USER_WRONG_PASSWORD: {
    statusCode: StatusCodes.BAD_REQUEST,
    errorCode: 'USER_WRONG_PASSWORD',
    message: 'The given password is wrong!',
  },
  USER_LOGIN_ATTEMPT_EXCEEDED: {
    statusCode: StatusCodes.UNPROCESSABLE,
    errorCode: 'USER_LOGIN_ATTEMPT_EXCEEDED',
    message: 'Too many login attempts!',
  },
  EMAIL_CAN_NOT_BE_SEND: {
    statusCode: StatusCodes.BAD_REQUEST,
    errorCode: 'EMAIL_CAN_NOT_BE_SEND',
    message: 'Error on sending emails',
  },
  SERVER_TIMEOUT: {
    statusCode: StatusCodes.SERVER_TIMEOUT,
    errorCode: 'SERVER_TIMEOUT',
    message: 'The server experience timeout, please try again later!',
  },
};

export default CustomErrors;
