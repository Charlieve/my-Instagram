import React, { useRef, useEffect, useContext, useMemo } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import createStyles from "../styles/styles";
import message from "../features/message/messageHandler";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

const EmojiButton = ({ emoji, contactId }) => {
  const styles = createStyles();
  const { messageData, contactIndex, reacting } =
    useContext(ChatMessageContext);
  const userId = useSelector(selectUserId);
  const userIdWithOutDot = userId.replace(".", "#");
  const selected = reacting?.message?.reactions?.[userIdWithOutDot] === emoji;
  return (
    <Pressable
      onPress={() => {
        message.sendUpdatedMessageReaction({
          contactIndex,
          messageIndex: reacting.message.index,
          emoji,
          targetUserId: Array.isArray(contactId) ? contactId : [contactId],
        });
        reacting?.closeExpended();
      }}
    >
      <View style={styles.css.chatEmojiButton}>
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
        {selected && (
          <View
            style={[
              styles.css.dot,
              {
                position: "absolute",
                bottom: 5,
                backgroundColor: styles.colors.subText,
                width: 4,
              },
            ]}
          />
        )}
      </View>
    </Pressable>
  );
};

const ChatMessageReactionEmoji = ({ contactId }) => {
  const styles = createStyles();
  const progress = useRef(new Animated.Value(0)).current;
  const { messageData, contactIndex, reacting } =
    useContext(ChatMessageContext);

  const userId = useSelector(selectUserId);
  const myMessage = useRef(false);
  const locationX = useRef(0);
  const locationY = useRef(0);
  if (reacting.display) {
    locationY.current = reacting.touchPoint.y;
    locationX.current = reacting.touchPoint.x;
    myMessage.current = reacting?.message?.userId === userId;
  }
  useEffect(() => {
    if (reacting.display) {
      Animated.spring(progress, { toValue: 1, useNativeDriver: false }).start();
    } else {
      Animated.spring(progress, { toValue: 0, useNativeDriver: false }).start();
    }
  });
  return useMemo(
    () => (
        <Animated.View
          style={[
            styles.css.chatEmojiReactionContainer,
            {
              top: locationY.current - 150,
              left: Math.min(locationX.current, 20),
              right: Math.min(locationX.current, 20),
            },
            {
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["80%", "0%"],
                  }),
                },
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [myMessage.current ? "150%" : "-150%", "0%"],
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [0, 0, 1],
                  }),
                },
              ],
              opacity: progress.interpolate({
                inputRange: [-1, 0, 0.5, 1],
                outputRange: [0, 0, 0, 1],
              }),
            },
          ]}
        >
          <View style={styles.css.chatEmojiReactionComponent}>
            <EmojiButton emoji="❤️" contactId={contactId} />
            <EmojiButton emoji="😮" contactId={contactId} />
            <EmojiButton emoji="😂" contactId={contactId} />
            <EmojiButton emoji="😢" contactId={contactId} />
            <EmojiButton emoji="😡" contactId={contactId} />
            <EmojiButton emoji="👍" contactId={contactId} />
          </View>
        </Animated.View>
    ),
    [reacting]
  );
};

export default ChatMessageReactionEmoji;
