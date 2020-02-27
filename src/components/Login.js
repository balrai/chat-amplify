import React, { Component } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { Notification, Message } from 'element-react';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    verify: false,
    code: ''
  };

  handleVerification = async e => {
    e.preventDefault();

    const { username, code } = this.state;
    try {
      const resut = await Auth.confirmSignUp(username, code, {
        // Optional. Force user confirmation irrespective of existing alias. By default set to True.
        forceAliasCreation: true
      });

      Notification({
        type: 'success',
        message: 'Account verified'
      });
      this.signin();
    } catch (err) {
      console.log('error:  ', err);
      if (err.code === 'CodeMismatchException') {
        Notification({
          type: 'error',
          message: 'Invalid Code'
        });
      } else {
        Notification({
          type: 'error',
          message: err.message || 'Error verifying code'
        });
      }
    }
  };

  resendVerificationCode = async e => {
    e.preventDefault();
    const { username } = this.state;
    try {
      const result = await Auth.resendSignUp(username);
      Notification({
        type: 'success',
        message: 'Verification code sent to your email.'
      });
    } catch (err) {
      Notification({
        type: 'error',
        message: 'Error sending code.'
      });
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.signin();
  };

  signin = async () => {
    try {
      const { username, password, verify } = this.state;
      console.log(username, password);
      const user = await Auth.signIn(username, password);
      console.log('user:', user);
    } catch (err) {
      console.log(err);
      Message({
        title: 'Error',
        type: 'warning',
        duration: 5000,
        message: `${err.message || 'Error signing in.'}`
      });
      if (err.code === 'UserNotConfirmedException')
        this.setState({ verify: true });
      if (err.code === 'NotAuthorizedException')
        this.setState({ verify: false });
    }
  };

  render() {
    const { changeStatus } = this.props;
    const { username, password, verify, code } = this.state;
    return (
      <div className="login-form">
        {!verify &&
          <form onSubmit={this.handleSubmit}>
            <div className="form-title">Login</div>
            <div className="form-group-login">
              <label htmlFor="username">Username</label>
              <input
                required
                type="text"
                value={username}
                onChange={e => this.setState({ username: e.target.value })}
              />
            </div>
            <div className="form-group-login">
              <label htmlFor="password">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </div>
            <div>
              <input
                // disabled={!username || !password}
                type="submit"
                value="Login"
                id="login-btn"
              />
            </div>
            <div className="form-footer">
              <div
                className="form-footer-text"
                onClick={() => changeStatus('register')}
              >
                Sign up for new account.
              </div>
            </div>
          </form>}
        {verify &&
          <form onSubmit={this.handleVerification}>
            <div className="form-title">Verification</div>
            <div className="form-group-login">
              <label htmlFor="company">Code</label>
              <input
                type="text"
                value={code}
                onChange={e => this.setState({ code: e.target.value })}
              />
            </div>
            <div>
              <input type="submit" value="Verify" id="login-btn" />
            </div>
            <div className="resend-code" onClick={this.resendVerificationCode}>
              Re-send verification code.
            </div>
          </form>}
      </div>
    );
  }
}
