export default (body, options) => {
  if (Object.keys(body).length === 0) {
    return false;
  }

  let result;
  if (options) {
    result = options.map(option => !!body[option]);
  }

  if (result && result.every(res => res === true)) {
    return true;
  }
  return false;
};
