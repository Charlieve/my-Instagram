import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
import createStyles from "../styles/styles";

const CircleProgress = ({ color, size, progress }) => {
  const strokeWidth = size / 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (progress * circumference) / 100;
  return (
    <Svg
      style={{
        width: "100%",
        height: "100%",
        transform: [{ rotateZ: "-90deg" }],
      }}
    >
      <Circle
        cx="50%"
        cy="50%"
        r={radius}
        fill={progress < 100 ? "none" : color}
        stroke={color}
        strokeWidth={size / 25}
        strokeLinecap="round"
        strokeDasharray={[dash, circumference - dash]}
      />
    </Svg>
  );
};

const ChatMessageQuickReply = ({ style = {}, size, color, progress }) => {
  progress = Math.min(progress, 100);
  const styles = createStyles();
  return (
    <View
      style={[
        style,
        {
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
          opacity: (progress - 50) / 50,
        },
      ]}
    >
      <CircleProgress
        color={styles.colors.border}
        size={size}
        progress={progress}
      />
      <Icon
        name="arrow-undo"
        size={(size * 0.7 * progress) / 100}
        color={styles.colors.text}
        style={{ position: "absolute" }}
      />
    </View>
  );
};

export default ChatMessageQuickReply;
