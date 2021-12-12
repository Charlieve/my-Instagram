import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView } from "react-native";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

import { ChatMessageContext } from "./ChatMessageContext";
import ChatMessageContent from "./ChatMessageContent";
import ChatMessageInput from "./ChatMessageInput";

const ChatMessageProvider = ({ contactId }) => {
  const userId = useSelector(selectUserId);
  const [inputContent, onChangeText] = useState("");
  return (
    <ChatMessageContext.Provider value={{ inputContent, onChangeText }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={85}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <ChatMessageContent />
          <ChatMessageInput />
        </View>
      </KeyboardAvoidingView>
    </ChatMessageContext.Provider>
  );
};

export default ChatMessageProvider;
