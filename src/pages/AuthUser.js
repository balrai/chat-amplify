import React, { Component } from 'react';
import { Auth, Hub } from 'aws-amplify';

import Login from '../components/Login';
import Register from '../components/Register';

export default class AuthUser extends Component {
  state = {
    status: 'login'
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { username, password } = this.state;
    const user = await Auth.signIn(username, password);
    console.log('user:', user);
  };

  handleChangeStatus = val => {
    this.setState({
      status: val
    });
  };

  render() {
    const { status } = this.state;
    return status === 'login'
      ? <Login changeStatus={this.handleChangeStatus} />
      : <Register changeStatus={this.handleChangeStatus} />;
    // <div className="login">
    //   <form onSubmit={this.handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="username"
    //       onChange={e => this.inputChangeHandler('username', e)}
    //       value={username}
    //     />
    //     <input
    //       type="password"
    //       placeholder="password"
    //       onChange={e => this.inputChangeHandler('password', e)}
    //       value={password}
    //     />
    //     <input type="submit" value="Submit" />
    //   </form>
    // </div>
  }
}
