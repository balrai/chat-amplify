import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { Icon, Loading } from 'element-react';
import { history } from '../pages/Chat';
import Conversation from "./Conversation"
import { UserContext } from '../App';
import * as Mutation from '../graphql/mutations';
import * as Query from '../graphql/queries';


const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      username
      company
      phone
      fullName
      email
      createdAt
      updatedAt
    }
    nextToken
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
    }
    nextToken
    total
  }
}
`;

const createConversationLink = `mutation CreateConversationLink(
  $input: CreateConversationLinkInput!
  $condition: ModelConversationLinkConditionInput
) {
  createConversationLink(input: $input, condition: $condition) {
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
     
      createdAt
      updatedAt
    }
    conversationLinkUserId
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

export default class Users extends Component {
  state = {
    users: [],
    profile: {},
    showProfile: false,
    showConversation: false,
    conversationID: "",
    name: ""
  }


  startConversation = async (user) => {
    // Check if conversation already exists
    const ownerUsername = user.username;
    const otherUsername = this.state.profile.username;
    console.log("names", ownerUsername, otherUsername)

    try {
      const result = await API.graphql(graphqlOperation(searchConversations, {
        filter: {
          and: [
            { members: { eq: ownerUsername } },
            { members: { eq: otherUsername } }
          ]
        }
      }))
      console.log("conversation ID: ", result.data.searchConversations.items)
      const conversationId = result.data.searchConversations.items;
      if (conversationId.length < 1) // no existing coversation
      {
        // create new conversation and conversation Link and return conversation ID for creating conversation Link
        this.createNewConversation(user);
      } else {
        // return conversationID to resume the conversation
        const arr = conversationId[0].name.split(" and ");
        const name = arr.filter(val => val !== user.username)
        console.log(`Push to ${conversationId[0].id}/:${name}`)
        this.setState({
          showConversation: true,
          conversationID: conversationId[0].id,
          name
        })
        // history.push(`/events/hkex-demo/chat/conversation/${conversationId[0].id}/${name}`)
      }
    } catch (err) {
      console.log("Error searching if the conversation exists.", err)
    }
  }

  createNewConversation = async (user) => {
    const { profile } = this.state;
    const ownerID = user.attributes.sub;
    console.log("owner ID:", ownerID)

    const convInput = {
      name: user.username + " and " + profile.username,
      members: [profile.username, user.username]
    }
    try {
      // create conversation
      const conversation = await API.graphql(graphqlOperation(Mutation.createConversation, { input: convInput }))
      console.log("Conversation:", conversation)

      // create conversation link for both user
      const ownerInput = {
        conversationLinkUserId: ownerID,
        conversationLinkConversationId: conversation.data.createConversation.id
      }
      const friendInput = {
        conversationLinkUserId: profile.id,
        conversationLinkConversationId: conversation.data.createConversation.id
      }
      console.log("ownerInput", ownerInput)
      const link1 = await API.graphql(graphqlOperation(createConversationLink, { input: ownerInput }));
      const link2 = await API.graphql(graphqlOperation(createConversationLink, { input: friendInput }))
      console.log("link1 and link2", link1, link2)
      // TODO: push to converstion with conversationId and conversation name
      // history.push(`/events/hkex-demo/chat/conversation/${conversation.data.createConversation.id}/${profile.username}`)
      this.setState({
        showConversation: true,
        conversationID: conversation.data.createConversation.id,
        name: profile.username
      })


    } catch (err) {
      console.log("Error creating conversation.", err)
    }
  }

  goBack = () => {
    this.setState({
      showConversation: false,
      conversationID: "",
      name: ""
    })
  }

  render() {
    const { showProfile, profile, showConversation, conversationID, name } = this.state;

    return (
      <UserContext.Consumer>
        {({ owner }) => (
          <Connect
            query={graphqlOperation(listUsers)}
          >
            {({ data, loading, errors }) => {
              if (errors.length > 0) return console.log(errors);
              if (loading) return <div className="loading-box"><Loading /></div>;
              console.log("data", data, owner)

              const users = data.listUsers.items;
              console.log("usersss,", owner)
              return (
                <>
                  {showConversation && <Conversation conversationId={conversationID} conversationName={name} goBack={this.goBack} />}
                  {!showConversation &&
                    <> {
                      users.length < 1 ?
                        <div className="empty-list">
                          <Icon style={{ color: "#ffa500" }} name="warning" className="icon" />&nbsp;
                          Users list is empty!
              </div>
                        :
                        <div className="users-box">
                          {users.map(user =>
                            (user.username !== owner.username) &&
                            <div className="people" key={user.id}>

                              <div onClick={() => this.setState({ showProfile: true, profile: user })}>
                                <Icon name="user-solid" className="icon" style={{ color: "#9764c5", cursor: "pointer" }} />
                                <div className="username">{user.username}</div>
                              </div>
                            </div>


                          )
                          }
                          {showProfile && (
                            <div className="profile-wrapper"
                              onClick={() =>
                                this.setState({ showProfile: false })
                              }
                            >
                              <div className="profile" onClick={(e) => e.stopPropagation()}>
                                <div className="profile-left">
                                  <Icon name="user-solid" className="icon" />
                                </div>
                                <div className="profile-right">
                                  <div>
                                    <div className="profile-name">{profile.username}</div>
                                    <div className="profile-company">{profile.company}</div>
                                    <div className="profile-email">{profile.email}</div>
                                    <div className="profile-question">Do you want to send message to {profile.username}?</div>
                                    <div className="profile-choice">
                                      <div className="yes" onClick={() => {
                                        this.setState({ showProfile: false });
                                        this.startConversation(owner);

                                      }}>Yes</div>
                                      <div className="cancel" onClick={() => this.setState({ showProfile: false })}>Cancel</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                    }
                    </>}
                </>
              );

            }}
          </Connect>
        )}
      </UserContext.Consumer>
    );

  }
}
