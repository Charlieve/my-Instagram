import React from "react";
import { Text } from "react-native";
import ChatMessageSingle from "./ChatMessageSingle";
import ChatMessageGroup from "./ChatMessageGroup";

const ChatMessage = ({ route }) => {
  const contactId = route.params.contactId;
  if (contactId.length === 1) {
    return <ChatMessageSingle contactId={contactId[0]} />;
  } else {
    return <ChatMessageGroup contactId={contactId} />;
  }
};

export default ChatMessage;
