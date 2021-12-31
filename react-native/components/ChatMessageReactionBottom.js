import React, { useContext, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import createStyles from "../styles/styles";
import { ChatMessageContext } from "./ChatMessageContext";

const ChatMessageReactionBottom = ({ contactId }) => {
  const styles = createStyles();
  const { messageData, contactIndex, reacting } =
    useContext(ChatMessageContext);

  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reacting.display) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [reacting.display]);
  return (
    <Animated.View
      style={[
        styles.css.messageReactionBottomComponent,
        {
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [70, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Pressable style={styles.css.messageReactionBottomButton}>
          <Text style={[styles.css.superBoldFont, { fontSize: 16 }]}>
            Reply
          </Text>
        </Pressable>
        <Pressable style={styles.css.messageReactionBottomButton}>
          <Text
            style={[
              styles.css.superBoldFont,
              { fontSize: 16, color: styles.colors.warning },
            ]}
          >
            Report
          </Text>
        </Pressable>
        <Pressable style={styles.css.messageReactionBottomButton}>
          <Text style={[styles.css.superBoldFont, { fontSize: 16 }]}>More</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default ChatMessageReactionBottom;
