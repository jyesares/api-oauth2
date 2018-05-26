import React from 'react';
import styled, { css } from 'react-emotion';

import mq from '../media/screens';

import { Page, Header, Login } from '../components';

const LoginContainer = styled('div')({
  margin: '50px'
});

export default () => (
  <Page>
    <Header>Welcome to this application</Header>
    <LoginContainer>
      <Login />
    </LoginContainer>
  </Page>
);
