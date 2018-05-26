import {
  postClients,
  getClients,
  getClientById,
} from './../../../api/v1/controllers';

/** CLIENTS */
async function postClientsHandler(req, res, next) {
  let response;
  try {
    response = await postClients(req);
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

async function getClientsHandler(req, res, next) {
  let response;
  try {
    response = await getClients(req);
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

async function getClientByIdHandler(req, res, next) {
  let response;
  try {
    response = await getClientById(req, req.params);
    return res.send(response);
  } catch (e) {
    return next(e);
  }
}

export { postClientsHandler, getClientsHandler, getClientByIdHandler };
