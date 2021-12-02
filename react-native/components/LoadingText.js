import React from "react";
import { View, Text } from "react-native";
import createStyles from "../styles/styles";
import LoadingEffect from "./LoadingEffect";

const LoadingText = ({style}) => {
  const styles = createStyles();
  return (
    <View style={style}>
      <LoadingEffect
        style={{ flex: 1, height: 8, marginTop: 4, marginBottom: 4 }}
      />
    </View>
  );
};

export default LoadingText;
