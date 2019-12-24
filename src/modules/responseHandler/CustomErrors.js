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
  USER_WRONG_LOGIN_CREDENTIALS: {
    statusCode: StatusCodes.BAD_REQUEST,
    errorCode: 'USER_WRONG_LOGIN_CREDENTIALS',
    message: 'User email or password wrong!',
  },
};

export default CustomErrors;
