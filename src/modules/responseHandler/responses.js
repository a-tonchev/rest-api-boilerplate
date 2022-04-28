import CustomErrors from './CustomErrors';

const createSuccessResponse = (ctx, data = {}) => ctx.body = {
  ok: true,
  data,
};

const createErrorResponse = (ctx, errorEl, data = {}, realError = null) => {
  let customError;

  if (typeof errorEl === 'string') {
    customError = errorEl && CustomErrors[errorEl]
      ? CustomErrors[errorEl]
      : CustomErrors.BAD_REQUEST;
  } else if (typeof errorEl === 'object') {
    customError = errorEl;
  } else {
    customError = CustomErrors.BAD_REQUEST;
  }

  const body = {
    code: customError.errorCode,
    ok: false,
    data,
  };

  const errorMessage = customError.message ? customError.message : '';
  const statusCode = customError.statusCode ?
    customError.statusCode :
    CustomErrors.BAD_REQUEST.statusCode;
  ctx.privateState.realError = realError;

  return ctx.throw({
    statusCode,
    errorMessage,
    body,
  });
};

const createValidateError = (validation, ctx, errorEl, data = {}) => {
  if (!validation) {
    return createErrorResponse(ctx, errorEl, data);
  }
};

export { createValidateError, createSuccessResponse, createErrorResponse };
