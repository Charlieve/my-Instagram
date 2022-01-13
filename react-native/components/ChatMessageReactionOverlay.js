import React, { useContext } from "react";
import { View, Pressable } from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import createStyles from "../styles/styles";

const ChatMessageReactionOverlay = () => {
  const styles = createStyles();
  const { reacting } = useContext(ChatMessageContext);
  return (
    <View
      style={[
        styles.absoluteFill,
        { display: reacting.display ? "flex" : "none" },
      ]}
    >
      <Pressable
        style={styles.absoluteFill}
        onPress={() => reacting?.closeExpended()}
      />
    </View>
  );
};

export default ChatMessageReactionOverlay;
