function getRandomInt(limit) {
  return Math.floor(Math.random() * limit);
}

function uniqueId(codeLength) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLen = chars.length;
  const arrayOfUndefined = new Array(codeLength).fill('');
  const buf = arrayOfUndefined.map(() => chars[getRandomInt(charsLen)]);
  return buf.join('');
}

export default uniqueId;
