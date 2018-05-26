import React from 'react';
import styled, { css } from 'react-emotion';

import mq from '../media/screens';

const Page = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
});

export default ({ children }) => <Page>{children}</Page>;
