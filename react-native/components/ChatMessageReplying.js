import React, { useContext } from "react";
import { View, Text } from "react-native";
import createStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

import { ChatMessageContext } from "./ChatMessageContext";

const ChatMessageReplying = () => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const { replying, setReplying } = useContext(ChatMessageContext);

  const closeReplying = () => {
    setReplying({ display: false });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        display: replying.display ? "flex" : "none",
        paddingLeft: 8,
        paddingVertical:10,
        paddingRight:0
      }}
    >
      <View style={{ flex: 1, justifyContent: "center"}}>
        <Text style={[styles.css.subFont,{fontSize:12,marginBottom:5}]}>
          Replying to{" "}
          {replying?.replyingMessage?.userId === userId
            ? "yourself"
            : replying?.replyingMessage?.userId}
        </Text>
        <Text style={styles.css.normalFont} numberOfLines={1}>
          {replying?.replyingMessage?.content}
        </Text>
      </View>
      <Icon
        name="close-outline"
        size={32}
        color={styles.colors.subText}
        onPress={() => closeReplying()}
      />
    </View>
  );
};

export default ChatMessageReplying;
