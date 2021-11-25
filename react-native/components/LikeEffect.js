import React, { useRef, useEffect } from "react";
import { Animated, View, Easing } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

const LikeEffect = ({ click }) => {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!!click) {
      progress.setValue(0)
      Animated.timing(progress, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [click]);
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          opacity: progress.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 1, 1, 0],
            easing: Easing.easeInOut,
          }),
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [1, 1.1, 0.95],
              }),
            },
          ],
        }}
      >
        <Icon name="heart" color="white" size={250} />
      </Animated.View>
    </View>
  );
};

export default LikeEffect;
