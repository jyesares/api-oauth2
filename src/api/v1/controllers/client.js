import Client from '../models/client';

/** POST /api/clients */
async function postClients(req) {
  const client = new Client({ ...req.body });
  await client.save();
  return client;
}

/** GET /api/clients */
async function getClients() {
  const clients = await Client.find({});
  return clients;
}

export { postClients, getClients };
