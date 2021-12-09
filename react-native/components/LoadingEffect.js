import React, { useRef } from "react";
import { View, Animated, Easing, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import createStyles from "../styles/styles";

const LoadingEffect = ({ style }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const windowWidth =
    Dimensions.get("window").width > 800 ? 800 : Dimensions.get("window").width;
  const styles = createStyles();
  Animated.loop(
    Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }),
    { iterations: -1 }
  ).start();
  return (
    <View style={[{ borderRadius: "50%", overflow: "hidden" }, style]}>
      <View
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: styles.colors.subButton,
        }}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            height: "100%",
          },
          {
            width: progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                windowWidth * 0.2,
                windowWidth * 0.8,
                windowWidth * 0.5,
              ],
              ease: Easing.ease,
            }),
            left: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [windowWidth * -0.2, windowWidth],
              ease: Easing.ease,
            }),
          },
        ]}
      >
        <LinearGradient
          colors={[
            styles.colors.subButton,
            styles.colors.popup,
            styles.colors.popup,
            styles.colors.subButton,
          ]}
          locations={[0, 0.4, 0.6, 1]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
};

export default LoadingEffect;
