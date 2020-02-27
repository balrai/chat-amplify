import React, { Component } from 'react';
import { Route, Router, Link } from 'react-router-dom';
import { Icon } from 'element-react';
import { createBrowserHistory } from 'history';

import Conversations from '../components/Conversations';
import Conversation from '../components/Conversation';
import Users from '../components/Users';
import Profile from '../components/Profile';

export const history = createBrowserHistory();


export default class Chat extends Component {
    state = {
        open: "users"
    }
    componentDidMount() {
        this.handleUrlChange();
        history.listen((location, action) => {
            this.handleUrlChange();

        })
    }

    handleUrlChange = () => {
        let url = window.location.href;
        if (url.indexOf("users") > 0) {
            this.setState({ open: "users" })
        } else if (url.indexOf("profile") > 0) {
            this.setState({ open: "profile" })
        } else if (url.indexOf("conversation") > 0) {
            this.setState({ open: "conversation" })
        }
    }

    render() {
        const { open } = this.state;
        const { user } = this.props;

        return (
            <>
                <Router history={history}>
                    <div className="chat-link-box">
                        <div className={open === "conversations" ? "open" : ""} onClick={() => this.setState({ open: "conversations" })}><Icon name="chat-dot-round" className="icon" /> Converstions </div>
                        <div className={open === "users" ? "open" : ""} onClick={() => this.setState({ open: "users" })}><Icon name="user-solid" className="icon" /><Icon name="user-solid" className="icon" /> People</div>
                        <div className={open === "profile" ? "open" : ""} onClick={() => this.setState({ open: "profile" })}> <Icon name="user" className="icon" />Profile</div>
                    </div>

                    {/* <div className="chat-link-box">
                        <Link to="/events/hkex-demo/chat/conversations" className={open === "conversation" ? "open" : ""} onClick={() => this.setState({ open: "conversation" })}><Icon name="chat-dot-round" className="icon" /> Conversations</Link>
                        <Link to="/events/hkex-demo/chat/users" className={open === "users" ? "open" : ""} onClick={() => this.setState({ open: "users" })}><Icon name="user-solid" className="icon" /><Icon name="user-solid" className="icon" /> People</Link>
                        <Link to="/events/hkex-demo/chat/profile" className={open === "profile" ? "open" : ""} onClick={() => this.setState({ open: "profile" })}> <Icon name="user" className="icon" />Profile</Link>
                    </div> */}
                    <div className="messenger">
                        {open === "conversations" && <Conversations user={user} />}
                        {open === "users" && <Users />}
                        {open === "profile" && <Profile />}

                        {/* <Route path="/events/hkex-demo/chat/conversations" exact component={function () { return <Conversations user={user} /> }} />
                        <Route path="/events/hkex-demo/chat/users" component={Users} />
                        <Route path="/events/hkex-demo/chat/profile" component={Profile} />
                        <Route path="/events/hkex-demo/chat/conversation/:conversationId/:conversationName" component={Conversation} /> */}

                    </div>
                </Router>
            </>
        )
    }
}


