import Code from '../models/code';
import Token from '../models/token';

/** AUTHORIZE */
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

async function authorize(req) {
  const {
    query: {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
    },
  } = req;

  const code = new Code({
    value: uniqueId(16),
    clientId,
    redirectUri: encodeURIComponent(redirectUri),
  });

  await code.save();
  return { code };
}

/** TOKEN */
function token(req) {
  return 'token';
}

export { authorize, token };
