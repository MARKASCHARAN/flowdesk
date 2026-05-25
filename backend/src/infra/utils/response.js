export const sendResponse = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendError = (res, statusCode, message, errors = []) => {
  const response = {
    status: 'error',
    message,
  };
  
  if (errors && errors.length > 0) {
    response.errors = errors;
  }
  
  res.status(statusCode).json(response);
};
