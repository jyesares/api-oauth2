import { authorize, token, revoke } from './../../../api/v1/controllers';

/** OAUTH2 */
async function authorizeHandler(req, res, next) {
  let response;
  try {
    response = await authorize(req);
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

async function tokenHandler(req, res, next) {
  let response;
  try {
    response = await token(req);
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

async function revokeTokenHandler(req, res, next) {
  let response;
  try {
    response = await revoke(req);
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

export { authorizeHandler, tokenHandler, revokeTokenHandler };
