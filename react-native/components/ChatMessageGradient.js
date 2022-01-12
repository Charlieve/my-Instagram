import React from "react";
import { View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import createStyles from "../styles/styles";

const ChatMessageGradient = () => {
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const styles = createStyles();
  return (
    <View
      pointerEvents="none"
      style={styles.absoluteFill}
    >
      <LinearGradient
        colors={[
          styles.colors.chatBubbleGradient1,
          styles.colors.chatBubbleGradient2,
        ]}
        locations={[0, 1]}
        style={{ flex: 1, zIndex: -1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
};

export default ChatMessageGradient;