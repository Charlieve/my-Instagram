import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import {
  selectMessageByIndex,
  selectMessageIndexByUserId,
} from "../features/message/messageSlice";

import { ChatMessageContext } from "./ChatMessageContext";
import ChatMessageContent from "./ChatMessageContent";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageReactionBottom from "./ChatMessageReactionBottom";
import ChatMessageReactionEmoji from "./ChatMessageReactionEmoji";

const ChatMessageProviderComponent = (props) => {
  const { contactId } = props;
  const [inputContent, onChangeText] = useState("");
  const [reacting, setReacting] = useState({display:false});
  const contactIndex = useSelector((state) =>
    selectMessageIndexByUserId(state, contactId)
  );
  const messageData = useSelector((state) =>
    selectMessageByIndex(state, contactIndex)
  );
  return (
    <ChatMessageContext.Provider
      value={{
        inputContent,
        onChangeText,
        messageData,
        contactIndex,
        reacting,
        setReacting,
      }}
    >
      {props.children}
    </ChatMessageContext.Provider>
  );
};

const ChatMessageProvider = ({ contactId }) => {
  const userId = useSelector(selectUserId);
  return (
    <ChatMessageProviderComponent contactId={contactId}>
      <KeyboardAvoidingView
        behavior={
          Platform?.OS === "ios"
            ? "padding"
            : //  "height"
              "padding"
        }
        enabled
        keyboardVerticalOffset={85}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <ChatMessageContent contactId={contactId} />
          <ChatMessageInput contactId={contactId} />
          <ChatMessageReactionBottom contactId={contactId} />
          <ChatMessageReactionEmoji contactId={contactId} />
        </View>
      </KeyboardAvoidingView>
    </ChatMessageProviderComponent>
  );
};

export default ChatMessageProvider;
