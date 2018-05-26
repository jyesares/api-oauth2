import React from 'react';
import styled, { css } from 'react-emotion';
import { Link } from 'react-router-dom';

import mq from '../media/screens';

const Button = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  border: '1px solid darkBlue',
  borderRadius: '4px',
  color: 'darkBlue',
  ':hover': {
    backgroundColor: 'lightBlue',
    transform: 'rotateX(360deg)',
    transition: '1s ease-in-out'
  }
});

export default ({ link, children }) => (
  <Link to={link} style={{ textDecoration: 'none' }}>
    <Button>{children}</Button>
  </Link>
);
