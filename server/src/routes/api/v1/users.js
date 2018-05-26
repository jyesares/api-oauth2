import { postUsers, getUsers } from './../../../api/v1/controllers';

/** Users */
async function postUsersHandler(req, res, next) {
  let response;
  try {
    response = await postUsers(req);
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

async function getUsersHandler(req, res, next) {
  let response;
  try {
    response = await getUsers();
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

export { postUsersHandler, getUsersHandler };
