import React from 'react';
import ChatMessageSingle from "./ChatMessageSingle"

const ChatMessage = ({ route }) => {
  const contactId = route.params.contactId;
  if (contactId.length === 1) {
    return <ChatMessageSingle contactId={contactId[0]} />;
  }
};

export default ChatMessage;
