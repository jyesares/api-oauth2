import React from 'react';
import styled, { css } from 'react-emotion';

import mq from '../media/screens';

const Header = styled('div')({
  height: '100px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'lightBlue'
});

export default ({ children }) => <Header>{children}</Header>;
