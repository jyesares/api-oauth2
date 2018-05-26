/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Client, User } from '../../../api/v1/models';

import {
  getClients,
  postClients,
  getClientById,
} from '../../../api/v1/controllers';

describe('# client controller', () => {
  describe('* getClients', () => {
    afterEach(() => {
      if (Client.find.restore) Client.find.restore();
    });

    test('should return all clients', async () => {
      const req = { user: { _id: 'abcd' } };
      const stub = sinon.stub(Client, 'find');
      stub.resolves([
        {
          name: 'name',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          anotherInfo: {},
        },
      ]);

      const clients = await getClients(req);

      expect(clients).toBeInstanceOf(Array);
      clients.map((client) => {
        expect(client).toBeInstanceOf(Object);
        expect(client).toHaveProperty('name');
        expect(client).toHaveProperty('clientId');
        expect(client).toHaveProperty('clientSecret');
      });
    });

    test('should return all clients', async () => {
      const req = { user: { _id: 'abcd' } };
      const stub = sinon.stub(Client, 'find');
      stub.resolves([]);

      const clients = await getClients(req);

      expect(clients).toBeInstanceOf(Array);
      expect(clients).toMatchObject([]);
    });

    test('should call to find method', async () => {
      const req = { user: { _id: 'abcd' } };
      const stub = sinon.stub(Client, 'find');
      stub.resolves([
        {
          name: 'name',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          anotherInfo: {},
        },
      ]);

      await getClients(req);

      expect(stub.calledOnce).toBe(true);
    });

    test('should call find with user as argument', async () => {
      const req = { user: { _id: 'abcd' } };
      const stub = sinon.stub(Client, 'find');
      stub.resolves([
        {
          name: 'name',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          anotherInfo: {},
        },
      ]);

      await getClients(req);

      // eslint-disable-next-line
      expect(stub.calledWith({ userId: req.user._id })).toBe(true);
    });

    test('should return bad request error (400) when user has no id', async () => {
      const req = { user: '' };

      try {
        await getClients(req);
      } catch (e) {
        // eslint-disable-next-line
        expect(e).toBeInstanceOf(Error);
        expect(e.status).toBe(400);
      }
    });

    test('should return entity process error (422) when user does not exist', async () => {
      const req = { user: { _id: 'abcd' } };
      const stub = sinon.stub(Client, 'find');
      stub.resolves(null);
      try {
        await getClients(req);
      } catch (e) {
        // eslint-disable-next-line
        expect(e).toBeInstanceOf(Error);
        expect(e.status).toBe(422);
      }
    });
  });

  describe('* getClientById', () => {
    afterEach(() => {
      if (Client.findOne.restore) Client.findOne.restore();
    });

    test('should return a client', async () => {
      const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
      const stub = sinon.stub(Client, 'findOne');
      stub.resolves({
        name: 'name',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        anotherInfo: {},
      });

      const client = await getClientById(req, req.params);

      expect(client).toBeInstanceOf(Object);
      expect(client).toHaveProperty('name');
      expect(client).toHaveProperty('clientId');
      expect(client).toHaveProperty('clientSecret');
    });

    test('should call to findOne method', async () => {
      const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
      const stub = sinon.stub(Client, 'findOne');
      stub.resolves({
        name: 'name',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        anotherInfo: {},
      });

      await getClientById(req, req.params);

      expect(stub.calledOnce).toBe(true);
    });

    test('should call findOne with user and params as arguments', async () => {
      const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
      const stub = sinon.stub(Client, 'findOne');
      stub.resolves({
        name: 'name',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        anotherInfo: {},
      });

      await getClientById(req, req.params);

      // eslint-disable-next-line
      expect(stub.calledWith({ userId: req.user._id, clientId: req.params.id })).toBe(true);
    });

    test('should return bad request error (400) when user has no id', async () => {
      const req = { user: {}, params: { id: 'abcd' } };
      
      try {
        await getClientById(req, req.params);
      } catch (e) {
        // eslint-disable-next-line
        expect(e).toBeInstanceOf(Error);
        expect(e.status).toBe(400);
      }
    });

    test('should return entity process error (422) when user does not exist', async () => {
      const req = { user: { _id: 'abcd' }, params: { id: 'abcd' } };
      const stub = sinon.stub(Client, 'findOne');
      stub.resolves(null);
      try {
        await getClientById(req, req.params);
      } catch (e) {
        // eslint-disable-next-line
        expect(e).toBeInstanceOf(Error);
        expect(e.status).toBe(422);
      }
    });
  });

  describe('* postClients', () => {
    afterEach(() => {
      if (User.findOne && User.findOne.restore) User.findOne.restore();
      if (Client.prototype.save.restore) Client.prototype.save.restore();
    });

    test('should return a client when posting a client', async () => {
      const req = { body: { app_name: 'App Name', username: 'userA' } };
      const findOneStub = sinon.stub(User, 'findOne');
      const saveStub = sinon.stub(Client.prototype, 'save');
      findOneStub.resolves({
        username: 'userA',
        password: 'passA',
      });
      saveStub.resolves({});

      const client = await postClients(req);

      expect(client).toBeInstanceOf(Object);
      expect(client).toHaveProperty('name');
      expect(client.name).toBe('App Name');
      expect(client).toHaveProperty('clientId');
      expect([client.clientId]).toEqual(expect.arrayContaining([expect.stringMatching(/^([a-zA-Z0-9]){8}$/)]));
      expect(client).toHaveProperty('clientSecret');
      expect([client.clientSecret]).toEqual(expect.arrayContaining([expect.stringMatching(/^([a-zA-Z0-9]){32}$/)]));
    });

    test('should call to findOne method and save', async () => {
      const req = { body: { app_name: 'App Name', username: 'userA' } };
      const findOneStub = sinon.stub(User, 'findOne');
      const saveStub = sinon.stub(Client.prototype, 'save');
      findOneStub.resolves({
        username: 'userA',
        password: 'passA',
      });
      saveStub.resolves({});

      await postClients(req);

      expect(findOneStub.calledOnce).toBe(true);
      expect(saveStub.calledOnce).toBe(true);
    });

    test('should return Bad Request (400) when no provided app name', async () => {
      const req = { body: {} };
      try {
        await postClients(req);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.status).toBe(400);
      }
    });

    test('should return Unprocessable Entity (422) when username does not exist', async () => {
      const req = { body: { app_name: 'App Name', username: 'userA' } };
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.resolves(null);
      try {
        await postClients(req);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.status).toBe(422);
      }
    });
  });
});
