import React, { useContext } from "react";
import { ScrollView, View, Text, FlatList } from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import createStyles from "../styles/styles";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import ChatMessageHeaderUserInfo from "./ChatMessageHeaderUserInfo";

const ChatBubble = ({ message }) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const myMessage = message.userId === userId;
  return (
    <View
      style={{ flexDirection: "row", direction: myMessage ? "rtl" : "ltr" }}
    >
      <View
        style={[
          styles.css.chatBubble,
          myMessage && styles.css.chatBubbleSelf,
          message.status === "pending" && { opacity: 0.7 },
        ]}
      >
        <Text
          style={[styles.css.chatFont, myMessage && styles.css.chatFontSelf]}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const ChatMessageContent = ({ contactId }) => {
  const styles = createStyles();
  const { messageData, contactIndex } = useContext(ChatMessageContext);
  return (
    <FlatList
      data={messageData}
      renderItem={({ item }) => <ChatBubble message={item} />}
      keyExtractor={(item, index) => "message" + index}
      contentContainerStyle={styles.css.chatMessageContainer}
      ListHeaderComponent={<ChatMessageHeaderUserInfo contactId={contactId} />}
      // inverted={-1}
    />
  );
};

export default ChatMessageContent;
