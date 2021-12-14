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

const ChatMessageProvider = ({ contactId }) => {
  const userId = useSelector(selectUserId);
  const [inputContent, onChangeText] = useState("");
  const contactIndex = useSelector((state) =>
    selectMessageIndexByUserId(state, contactId)
  );
  const messageData = useSelector((state) =>
    selectMessageByIndex(state, contactIndex)
  );
  // console.log(messageData);
  return (
    <ChatMessageContext.Provider
      value={{ inputContent, onChangeText, messageData, contactIndex }}
    >
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
        </View>
      </KeyboardAvoidingView>
    </ChatMessageContext.Provider>
  );
};

export default ChatMessageProvider;
