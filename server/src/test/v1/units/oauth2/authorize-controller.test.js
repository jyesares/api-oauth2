/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Client, Code } from '../../../../api/v1/models';
import { authorize } from '../../../../api/v1/controllers';

describe('# oauth2 controller - authorize', () => {
  afterEach(() => {
    if (Client.findOne.restore) Client.findOne.restore();
    if (Code.prototype.save.restore) Code.prototype.save.restore();
  });

  test('should return object with authorization code, redirect_uri and clientId', async () => {
    const req = {
      query: {
        response_type: 'code',
        client_id: 'userIdA',
        redirect_uri: 'http://localhost',
      },
    };
    const findOneStub = sinon.stub(Client, 'findOne');
    findOneStub.resolves({
      userId: 'userIdA',
    });
    const saveStub = sinon.stub(Code.prototype, 'save');
    saveStub.resolves({});

    const code = await authorize(req);
    expect(code).toBeInstanceOf(Object);
    expect(code).toHaveProperty('code');
    expect(code).toHaveProperty('redirect_uri');
    expect(code).toHaveProperty('clientId');
  });

  test('should return a code object with code, decoded redirect_uri and clientId', async () => {
    const req = {
      query: {
        response_type: 'code',
        client_id: 'userIdA',
        redirect_uri: 'http://localhost',
      },
    };
    const findOneStub = sinon.stub(Client, 'findOne');
    findOneStub.resolves({
      userId: 'userIdA',
    });
    const saveStub = sinon.stub(Code.prototype, 'save');
    saveStub.resolves({});

    const code = await authorize(req);
    expect(code).toBeInstanceOf(Object);
    expect(code).toHaveProperty('code');
    expect([code.code]).toEqual(expect.arrayContaining([expect.stringMatching(/^([a-zA-Z0-9]){16}$/)]));
    expect(code).toHaveProperty('redirect_uri');
    expect([code.redirect_uri]).toEqual(expect.arrayContaining([expect.stringMatching(/^http?:\/\//)]));
    expect(code).toHaveProperty('clientId');
    expect(code.clientId).toBe('userIdA');
  });

  test('should return Bad Request Error (400) when query empty', async () => {
    const req = { query: {} };
    try {
      await authorize(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Bad Request Error (400) when no query', async () => {
    const req = {};
    try {
      await authorize(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Bad Request Error (400) when any required body field empty', async () => {
    const req = {
      query: {
        response_type: 'code',
        redirect_uri: 'http://localhost',
      },
    };
    try {
      await authorize(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Unprocessable Entity (422) if response type does not match code', async () => {
    const req = {
      query: {
        response_type: 'anotherWord',
        client_id: 'userIdA',
        redirect_uri: 'http://localhost',
      },
    };
    try {
      await authorize(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(422);
    }
  });

  test('should return Unprocessable Entity (422) if response type does not match code', async () => {
    const req = {
      query: {
        response_type: 'anotherWord',
        client_id: 'userIdA',
        redirect_uri: 'http://localhost',
      },
    };
    try {
      await authorize(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(422);
    }
  });

  test('should return Internal Server Error (500) if no exists client', async () => {
    const req = {
      query: {
        response_type: 'code',
        client_id: 'userIdA',
        redirect_uri: 'http://localhost',
      },
    };
    const findOneStub = sinon.stub(Client, 'findOne');
    findOneStub.resolves({
      userId: 'userIdA',
    });
    const saveStub = sinon.stub(Code.prototype, 'save');
    saveStub.resolves(null);
    try {
      await authorize(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(500);
    }
  });
});
