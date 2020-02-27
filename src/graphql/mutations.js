/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
export const updateUser = `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
export const deleteUser = `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
export const createConversation = `mutation CreateConversation(
  $input: CreateConversationInput!
  $condition: ModelConversationConditionInput
) {
  createConversation(input: $input, condition: $condition) {
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
export const createMessage = `mutation CreateMessage(
  $input: CreateMessageInput!
  $condition: ModelMessageConditionInput
) {
  createMessage(input: $input, condition: $condition) {
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
export const createConversationLink = `mutation CreateConversationLink(
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
export const updateConversationLink = `mutation UpdateConversationLink(
  $input: UpdateConversationLinkInput!
  $condition: ModelConversationLinkConditionInput
) {
  updateConversationLink(input: $input, condition: $condition) {
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
