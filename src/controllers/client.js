import Client from '../models/client';

/** POST /api/clients */
async function postClients(req, res, next) {
  const client = new Client({ ...req.body });
  try {
    await client.save();
    res.json({ data: client });
  } catch (e) {
    next(e);
  }
}

/** GET /api/clients */
async function getClients(req, res, next) {
  let clients;
  try {
    clients = await Client.find({});
    res.json(clients);
  } catch (e) {
    next(e);
  }
}

export { postClients, getClients };
