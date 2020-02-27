import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify'

import { Icon } from 'element-react'
import Conversation from './Conversation';

import * as Query from '../graphql/queries'

const onCreateConversationLink = `subscription OnCreateConversationLink($conversationLinkUserId: ID!) {
  onCreateConversationLink(conversationLinkUserId: $conversationLinkUserId) {
    id
    user {
      id
      username
      company
      phone
      fullName
      email
      conversations {
        nextToken
      }
      messages {
        nextToken
      }
      createdAt
      updatedAt
    }
    
    conversation {
      id
      messages {
        nextToken
      }
      associated {
        nextToken
      }
      name
      members
      createdAt
      updatedAt
    }
    conversationLinkConversationId
    createdAt
    updatedAt
  }
}
`;
const searchConversations = `query SearchConversations(
  $filter: SearchableConversationFilterInput
  $sort: SearchableConversationSortInput
  $limit: Int
  $nextToken: String
) {
  searchConversations(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      updatedAt
    }
    nextToken
    total
  }
}
`;

const listConversations = `query ListConversations(
  $filter: ModelConversationFilterInput
  $limit: Int
  $nextToken: String
) {
  listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      messages {
        nextToken
      }
      associated {
        nextToken
      }
      name
      members
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;

export default class Conversations extends Component {

  state = {
    conversationList: [],
    showConversation: false,
    conversationID: '',
    name: ''
  }

  async componentDidMount() {
    const { user } = this.props;
    console.log("user from conversation list", user)
    try {
      const conversationList = await API.graphql(graphqlOperation(searchConversations, {
        filter: {
          members: {
            eq: user.username
          }
        }
      }))
      console.log("conversationlist", conversationList)
      let tempList = conversationList.data.searchConversations.items;
      let sorted = tempList.sort(function (a, b) {
        console.log(new Date(b.updatedAt.toString()), "date")
        return new Date(b.updatedAt.toString()) - new Date(a.updatedAt.toString())
      })
      console.log("sorted: ", sorted)
      this.setState({ conversationList: sorted })
    } catch (err) {
      console.log("Error listing conversations: ", err)
    }
    // subscribe to new conversation
    try {
      console.log("subscribe to: ", user.attributes.sub)
      const subscribeToNewConversation = await API.graphql(graphqlOperation(onCreateConversationLink, {
        conversationLinkUserId: user.attributes.sub
      })).subscribe({
        next: newData => {
          console.log(newData, "newData");

          let updatedList = [...this.state.conversationList];
          console.log("old data:", updatedList)
          updatedList.push(newData.value.data.onCreateConversationLink.conversation)
          this.setState({ conversationList: updatedList })
        }
      })
    } catch (err) {
      console.log("Error subscribing to new conversation creation.", err)
    }
  }

  goBack = () => {
    this.setState({
      showConversation: false,
      conversationID: '',
      name: ''
    })
  }

  render() {
    const { conversationList, conversationID, name, showConversation } = this.state;
    const { user } = this.props;
    return (
      <>
        {showConversation && <Conversation conversationId={conversationID} conversationName={name} goBack={this.goBack} />}
        {!showConversation &&
          <>
            <div className="conversations-wrapper">
              {conversationList.map(conversation => {
                const arr = conversation.name.split(" and ");
                const name = arr.filter(val => val !== user.username)
                return (
                  <div key={conversation.id}
                    // to={`/events/hkex-demo/chat/conversation/${conversation.id}/${name}`}
                    onClick={() => this.setState({ showConversation: true, conversationID: conversation.id, name })}
                    className="conversation-box" >
                    <div className="conversation-name"><Icon name="message" className="icon" style={{ width: "20px" }} /> {name}</div>
                  </div>


                )
              })
              }
            </div>
          </>}
      </>
    );
  }
}
