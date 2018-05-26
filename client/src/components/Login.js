import React from 'react';
import styled, { css } from 'react-emotion';

import mq from '../media/screens';

import { Button } from './index';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { adolfo: null };
  }

  llamarAdolfo = async () => {
    const callit = await fetch('http://localhost:3001/adolfo', {
      method: 'GET',
      mode: 'no-cors'
    });
    console.log(callit);
    this.setState({
      adolfo: callit.body
    });
  };

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
        <div
          onClick={() => {
            console.log('hola');
            this.llamarAdolfo();
          }}
        >
          Loggin with Authorization Server
        </div>

        {this.state.adolfo && <h1>{this.state.adolfo}</h1>}
      </LoginContainer>
    );
  }
}

export default Login;
