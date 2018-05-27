/* global describe, test, expect, beforeEach, afterEach */

import sinon from 'sinon';

import { Token } from '../../../../api/v1/models';
import { revoke } from '../../../../api/v1/controllers';

describe('# oauth2 controller - revoke', () => {
  afterEach(() => {
    if (Token.findOne.restore) Token.findOne.restore();
    if (Token.prototype.remove.restore) Token.prototype.remove.restore();
  });

  test('should return empty object after revoking token and removing from database', async () => {
    const req = {
      body: {
        token: 'tokenA',
        token_type_hint: 'access_token',
      },
      user: {
        clientId: 'clientIdA',
      },
    };
    const findOneStub = sinon.stub(Token, 'findOne');
    findOneStub.resolves({
      accessToken: 'accessTokenA',
      refreshToken: 'refreshTokenA',
      expiresIn: 300,
      tokenType: 'Bearer',
      clientId: 'clientIdA',
      userId: 'userIdA',
      remove: () => {},
    });

    const output = await revoke(req);

    expect(output).toBeInstanceOf(Object);
    expect(Object.keys(output).length).toBe(0);
  });

  test('should return Bad Request (400) when body is empty', async () => {
    const req = {
      body: {},
      user: {
        clientId: 'clientIdA',
      },
    };

    try {
      await revoke(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Bad Request (400) when token type hint is not allowed', async () => {
    const req = {
      body: {
        token: 'tokenA',
        token_type_hint: 'bad_token_type',
      },
      user: {
        clientId: 'clientIdA',
      },
    };

    try {
      await revoke(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(400);
    }
  });

  test('should return Internal Server Error (500) when findOne request fails', async () => {
    const req = {
      body: {
        token: 'tokenA',
        token_type_hint: 'access_token',
      },
      user: {
        clientId: 'clientIdA',
      },
    };
    const findOneStub = sinon.stub(Token, 'findOne');
    findOneStub.throws(500);

    try {
      await revoke(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(500);
    }
  });

  test('should return (304) when token not found', async () => {
    const req = {
      body: {
        token: 'tokenA',
        token_type_hint: 'access_token',
      },
      user: {
        clientId: 'clientIdA',
      },
    };
    const findOneStub = sinon.stub(Token, 'findOne');
    findOneStub.resolves(null);

    try {
      await revoke(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.status).toBe(304);
    }
  });

  test('should return Unauthorized Error (401) when clientId does not match', async () => {
    const req = {
      body: {
        token: 'tokenA',
        token_type_hint: 'access_token',
      },
      user: {
        clientId: 'clientIdB',
      },
    };
    const findOneStub = sinon.stub(Token, 'findOne');
    findOneStub.resolves({
      accessToken: 'accessTokenA',
      refreshToken: 'refreshTokenA',
      expiresIn: 300,
      tokenType: 'Bearer',
      clientId: 'clientIdA',
      userId: 'userIdA',
    });

    try {
      await revoke(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Object);
      expect(e.status).toBe(401);
    }
  });

  test('should return Internal Server Error (500) when remove request fails', async () => {
    const req = {
      body: {
        token: 'tokenA',
        token_type_hint: 'access_token',
      },
      user: {
        clientId: 'clientIdA',
      },
    };
    const findOneStub = sinon.stub(Token, 'findOne');
    findOneStub.resolves({
      accessToken: 'accessTokenA',
      refreshToken: 'refreshTokenA',
      expiresIn: 300,
      tokenType: 'Bearer',
      clientId: 'clientIdA',
      userId: 'userIdA',
    });
    const removeStub = sinon.stub(Token.prototype, 'remove');
    removeStub.throws(500);

    try {
      await revoke(req);
    } catch (e) {
      expect(e).toBeInstanceOf(Object);
      expect(e.status).toBe(500);
    }
  });
});
