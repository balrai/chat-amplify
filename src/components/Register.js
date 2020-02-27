import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Message, Notification } from 'element-react';

export default class Register extends Component {
  state = {
    username: '',
    name: '',
    password: '',
    email: '',
    phone: '',
    profile: '',
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

  signin = async () => {
    try {
      const { username, password } = this.state;
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
    }
  };

  handleSubmit = async e => {
    const { username, password, email, phone, profile, name } = this.state;
    e.preventDefault();
    try {
      const user = await Auth.signUp({
        username,
        password,
        attributes: {
          name,
          email,
          phone_number: phone,
          profile
        }
      });
      Message({
        title: 'success',
        message: 'Registration successful! Please verify your email address.',
        duration: 5000
      });
      this.setState({ verify: true });
    } catch (err) {
      Message({
        title: 'Error',
        type: 'warning',
        message: `${err.message || 'Error registering user.'}`
      });
    }
  };
  render() {
    const { changeStatus } = this.props;
    const {
      username,
      password,
      email,
      phone,
      profile,
      name,
      verify,
      code
    } = this.state;
    return (
      <div className="login-form">
        {!verify &&
          <form onSubmit={this.handleSubmit}>
            <div className="form-title">Register</div>
            <div className="form-group-login">
              <label htmlFor="company">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </div>
            <div className="form-group-login">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => this.setState({ username: e.target.value })}
              />
            </div>
            <div className="form-group-login">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </div>
            <div className="form-group-login">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </div>
            <div className="form-group-login">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                value={profile}
                onChange={e => this.setState({ profile: e.target.value })}
              />
            </div>
            <div className="form-group-login">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                value={phone}
                placeholder="+85265451937"
                onChange={e => this.setState({ phone: e.target.value })}
              />
            </div>
            <div>
              <input type="submit" value="Register" id="login-btn" />
            </div>
            <div className="form-footer">
              <div
                className="form-footer-text"
                onClick={() => changeStatus('login')}
              >
                Sign in your account.
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
