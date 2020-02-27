import React, { Component } from 'react';
import { Connect } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { Icon, Loading } from 'element-react';

import * as Query from '../graphql/queries';
import * as Mutation from "../graphql/mutations";
import * as Subscriptions from "../graphql/subscriptions";
import { UserContext } from '../App';

const nextToken = ""


const getConversation = `query GetConversation($id: ID!) {
  getConversation(id: $id) {
    id
    messages(limit: 50) {
      items {
        id
        authorId
        content
        conversationId
        createdAt
        updatedAt
      }
      nextToken
    }
    associated {
      items {
        id
        conversationLinkUserId
        createdAt
        updatedAt
      }
      nextToken
    }
    name
    members
    createdAt
    updatedAt
  }
}
`;

const createMessage = `mutation CreateMessage(
  $input: CreateMessageInput!
  $condition: ModelMessageConditionInput
) {
  createMessage(input: $input, condition: $condition) {
    id
  }
}
`;

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      conversation: []
    }
    this.myRef = React.createRef();
    this.msgSubscription = null;
  }

  scrollToBottom = () => {
    console.log("this.myRef,,", this.myRef.current)
    if (this.myRef.current !== null) {
      console.log("scroll")
      this.myRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  async componentDidMount() {
    const { conversationId, conversationName } = this.props;

    // get conversation
    try {
      const conversation = await API.graphql(graphqlOperation(getConversation, { id: conversationId }));
      console.log("conversation", conversation)
      this.setState({ conversation: conversation.data.getConversation.messages.items })
    } catch (err) {
      console.log("Error getting conversation", err)
    }

    // subscribe to new msg
    try {
      this.msgSubscription = await API.graphql(graphqlOperation(Subscriptions.onCreateMessage, { conversationId: conversationId })).subscribe({
        next: this.onNewMsg
      })

    } catch (err) {
      console.log("Error subscribing to new msg.", err)
    }
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    if (this.msgSubscription !== null)
      this.msgSubscription.unsubscribe();
  }

  sendMsg = async (owner, conversationId) => {
    console.log(owner.username, "owner...")
    const input = {
      authorId: owner.username,
      content: this.state.msg,
      conversationId: conversationId,
      messageConversationId: conversationId
    }
    try {
      const result = await API.graphql(graphqlOperation(Mutation.createMessage, { input }))
      this.setState({ msg: "" })
    } catch (err) {
      console.log("Error creating msg.", err)
    }

  }

  onNewMsg = (newData) => {
    let updatedData = [...this.state.conversation];
    console.log("uddated data:", updatedData)
    updatedData.push(newData.value.data.onCreateMessage);
    return this.setState({ conversation: updatedData });
  }

  render() {
    const { msg, conversation } = this.state;
    const { conversationId, conversationName, goBack } = this.props;
    // console.log("ConversationId and name: ", conversationId, conversationName);
    return (
      <>
        <UserContext.Consumer >
          {({ owner }) => (
            <>
              <div className="conversation-title">
                <div className="back" onClick={() => goBack()}>{"<"}</div>
                {conversationName}
              </div>
              < div className="messages-box" >
                {conversation.map((message) => {
                  if (message.authorId === owner.username) {
                    return (
                      <div className="owner-msg" key={message.id}>
                        <div>
                          <div className="time">
                            {new Date(message.createdAt.toString()).toString().split(' ').slice(0, 3).join(' ')}
                            &nbsp;&nbsp;
                            {new Date(message.createdAt.toString()).toString().split(' ').slice(4, 5).join(' ')}
                          </div>
                          {message.content}
                        </div>

                      </div>
                    )
                  } else {
                    return (
                      <div className="friend-msg" key={message.id}>
                        <div>
                          <div className="time">
                            {new Date(message.createdAt.toString()).toString().split(' ').slice(0, 3).join(' ')}
                            &nbsp;&nbsp;
                            {new Date(message.createdAt.toString()).toString().split(' ').slice(4, 5).join(' ')}
                          </div>
                          {message.content}
                        </div>
                      </div>
                    )
                  }
                })
                }
                {console.log("conversaton", conversation)}
                <div ref={this.myRef} />
              </div>
              <div className="msg-input">
                <textarea type="text" value={this.state.msg} onChange={(e) => this.setState({ msg: e.target.value })} />
                <button disabled={msg === ""} id="send" onClick={() => this.sendMsg(owner, conversationId)}>Send</button>
              </div>
            </>
          )
          }
        </UserContext.Consumer>
      </>
    )
  }
}
