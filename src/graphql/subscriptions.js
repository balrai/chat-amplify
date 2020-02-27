/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateConversationLink = `subscription OnCreateConversationLink($conversationLinkUserId: ID!) {
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
export const onCreateMessage = `subscription OnCreateMessage($conversationId: ID!) {
  onCreateMessage(conversationId: $conversationId) {
    id
    author {
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
    authorId
    content
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
    conversationId
    createdAt
    updatedAt
  }
}
`;
export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
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
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
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
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
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
