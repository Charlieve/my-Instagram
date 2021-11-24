import React from "react";
import { View, Text } from "react-native";
import createStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";

const NotCreateYet = () => {
  const styles = createStyles();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Icon name="hammer" color={styles.colors.subButton} size={60} />
      <Text style={{color: styles.colors.subButton,marginTop:20}}>Building</Text>
    </View>
  );
};

export default NotCreateYet;
