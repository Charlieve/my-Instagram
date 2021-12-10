import React from "react";
import { View } from "react-native";
import { createStackNavigator, Header } from "@react-navigation/stack";
import createStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";

import ChatScreen from "./ChatScreen";
import ChatMessage from "./ChatMessage";
import ChatNewMessage from "./ChatNewMessage"

const Stack = createStackNavigator();

export default function ChatStackScreen() {
  const styles = createStyles();
  return (
    <Stack.Navigator screenOptions={() => ({ headerShown: false })}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChatMessage" component={ChatMessage} />
      <Stack.Screen name="ChatNewMessage" component={ChatNewMessage} />
    </Stack.Navigator>
  );
}
