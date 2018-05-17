import { postClients, getClients } from './../../../api/v1/controllers';

/** CLIENTS */
async function postClientsHandler(req, res, next) {
  let response;
  try {
    response = await postClients(req);
    res.send(response);
  } catch (e) {
    next(e);
  }
}

async function getClientsHandler(req, res, next) {
  let response;
  try {
    response = await getClients();
    res.send(response);
  } catch (e) {
    next(e);
  }
}

export { postClientsHandler, getClientsHandler };
