import React, { useContext } from "react";
import { View, Text } from "react-native";
import createStyles from "../styles/styles";

import { ChatMessageContext } from "./ChatMessageContext";

const ChatMessageReplyingBG = () => {
  const styles = createStyles();
  const { replying } = useContext(ChatMessageContext);
  return (
    <View
      style={[
        {
          backgroundColor: styles.colors.background,
          borderTopWidth: 0.5,
          borderColor: styles.colors.border,
          display: replying.display?"flex": "none"
        },
        styles.absoluteFill,
      ]}
    />
  );
};

export default ChatMessageReplyingBG;
