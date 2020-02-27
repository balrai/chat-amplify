/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    company
    phone
    fullName
    email
    conversations {
      items {
        id
        conversationLinkUserId
        conversationLinkConversationId
        createdAt
        updatedAt
      }
      nextToken
    }
    messages {
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
    createdAt
    updatedAt
  }
}
`;
export const listUsers = `query ListUsers(
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
      conversations {
        nextToken
      }
      messages {
        nextToken
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;
export const getConversation = `query GetConversation($id: ID!) {
  getConversation(id: $id) {
    id
    messages {
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
        conversationLinkConversationId
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
export const listConversations = `query ListConversations(
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
export const getConversationLink = `query GetConversationLink($id: ID!) {
  getConversationLink(id: $id) {
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
export const listConversationLinks = `query ListConversationLinks(
  $filter: ModelConversationLinkFilterInput
  $limit: Int
  $nextToken: String
) {
  listConversationLinks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      user {
        id
        username
        company
        phone
        fullName
        email
        createdAt
        updatedAt
      }
      conversationLinkUserId
      conversation {
        id
        name
        members
        createdAt
        updatedAt
      }
      conversationLinkConversationId
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;
export const searchConversations = `query SearchConversations(
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
    total
  }
}
`;
