import React from 'react';
import styled, { css } from 'react-emotion';

import mq from '../media/screens';

import { Button } from './index';

class Login extends React.Component {
  render() {
    const LoginContainer = styled('div')({
      border: '1px solid lightBlue',
      borderRadius: '20px',
      padding: '20px',
      width: '300px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    });

    const Text = styled('div')({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      textJustify: 'justify'
    });

    return (
      <LoginContainer>
        <Text>
          Choose one of the following ways to authenticate in the application
        </Text>
        <Button link="">Loggin with Authorization Server</Button>
      </LoginContainer>
    );
  }
}

export default Login;
