import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Auth, Hub, API, graphqlOperation } from 'aws-amplify'

import NavigationBar from './components/Navbar'
import AuthUser from './pages/AuthUser'
import Chat from './pages/Chat'
import Agenda from './pages/Agenda'
import Bio from './pages/Bio'


// import { getUser } from './graphql/queries'
// import { createUser } from './graphql/mutations'

export const UserContext = React.createContext();

const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    company
    phone
    fullName
    email

  }
}
`;


const createUser = `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id 
    }
  }`;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userAttributes: null,
      page: "agenda"
    }


  }

  componentDidMount() {
    this.getUserData();
    Hub.listen('auth', data => {
      const { payload } = data;
      this.onAuthEvent(payload);
    });
  }

  onAuthEvent = payload => {
    switch (payload.event) {
      case 'signIn':
        console.log('Signed in');
        this.getUserData();
        this.registerNewUser(payload.data);
        break;
      case 'singUp':
        console.log('Signed up');
        break;
      case 'signOut':
        console.log('Signed out');
        this.setState({ user: null });
        break;
      default:
        return;
    }
  };

  registerNewUser = async (signInData) => {

    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    }
    console.log("id...", signInData.signInUserSession.idToken.payload.sub)
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput))
    console.log("register ", data)

    // register if no user found
    if (!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.signInUserSession.idToken.payload.email,
          company: signInData.signInUserSession.idToken.payload.profile,
          phone: signInData.signInUserSession.idToken.payload.phone_number,
          fullName: signInData.signInUserSession.idToken.payload.name,

        }
        console.log("userinput", registerUserInput)
        const newUser = await API.graphql(graphqlOperation(createUser, { input: registerUserInput }));
        console.log(newUser)
      } catch (err) {
        console.log("Error, registering user", err)
      }
    }
    return;
  }

  getUserData = async () => {
    console.log("user")
    let user;
    try {
      user = await Auth.currentAuthenticatedUser();

    } catch (err) {
      console.log(err)
    }
    user ?
      this.setState({ user }, () => this.getUserAttributes(this.state.user))
      :
      this.setState({ user: null });
  };

  getUserAttributes = async authUserData => {
    const attributesArr = await Auth.userAttributes(authUserData);
    const attributesObj = await Auth.attributesToObject(attributesArr);
    this.setState({ userAttributes: attributesObj })
  }

  handleSingOut = async () => {
    try {
      await Auth.signOut()
    } catch (err) {
      console.log("Error signing out: ", err)
    }
  }

  changePage = (page) => {
    this.setState({ page })
  }


  render() {
    const { user, page } = this.state;
    return (!user ? <AuthUser /> :
      <UserContext.Provider value={{ owner: user }}>

        <Router >
          <>
            <NavigationBar status={page} changePage={this.changePage} signout={this.handleSingOut} />
            <div className="app-container">
              {page === "agenda" && <Agenda />}
              {page === "bio" && <Bio />}
              {page === "chat" && <Chat user={user} />}
              {/* <Route exact path="/events/hkex-demo/index" component={Agenda} />
              <Route path="/events/hkex-demo/bio" component={Bio} />
              <Route path="/events/hkex-demo/chat" component={function () { return (<Chat user={user} />) }} /> */}
            </div>
          </>
        </Router>
      </UserContext.Provider>
    );

  }
}
