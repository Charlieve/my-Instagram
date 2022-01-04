import React, { useRef, useEffect, useContext, useMemo } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import createStyles from "../styles/styles";
import message from "../features/message/messageHandler";

const EmojiButton = ({ emoji, contactId }) => {
  const styles = createStyles();
  const { messageData, contactIndex, reacting } =
    useContext(ChatMessageContext);
  return (
    <Pressable
      onPress={() =>
        message.sendUpdatedMessageReaction({
          contactIndex,
          messageIndex: reacting.message.index,
          emoji,
          targetUserId: Array.isArray(contactId) ? contactId : [contactId],
        })
      }
    >
      <View style={styles.css.chatEmojiButton}>
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
      </View>
    </Pressable>
  );
};

const ChatMessageReactionEmoji = ({ contactId }) => {
  const styles = createStyles();
  const progress = useRef(new Animated.Value(0)).current;
  const { messageData, contactIndex, reacting } =
    useContext(ChatMessageContext);

  const locationX = useRef(0);
  const locationY = useRef(0);
  if (reacting.display) {
    locationY.current = reacting.touchPoint.y;
    locationX.current = reacting.touchPoint.x;
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
          { top: locationY.current - 150, left: 20, right: 20 },
          {
            transform: [
              {
                scale: progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ],
            opacity: progress.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0, 0, 1],
            })
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
