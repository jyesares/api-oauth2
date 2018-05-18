import { authorize, token } from './../../../api/v1/controllers';

/** OAUTH2 */
async function authorizeHandler(req, res, next) {
  let response;
  try {
    response = await authorize(req);
    res.send(response);
  } catch (e) {
    next(e);
  }
}

async function tokenHandler(req, res, next) {
  let response;
  try {
    response = await token(req);
    res.send(response);
  } catch (e) {
    next(e);
  }
}

export { authorizeHandler, tokenHandler };
