import createError from 'http-errors';

import errors from '../config/errors.json';

export default (error => {
  console.log(errors[error]);
  const { statusCode, message } = errors[error];
  return createError(statusCode, message);
});