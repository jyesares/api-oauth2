import moment from 'moment';

import createToken from '../../../src/controllers/login/oauth';
import { createTokenFixture } from './fixtures';

test('return token', () => {
  const clock = sinon.useFakeTimers(moment('2018-05-14T23:49:50+02:00'));
  expect(createToken(createTokenFixture.in)).toBe(createTokenFixture.out);
});