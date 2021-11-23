import React, { useState } from "react";
import {Easing} from 'react-native'
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import ProfileScreen from './ProfileScreen'
import PostsDetailScreen from './PostsDetailScreen'
import createStyles from "../styles/styles";

const Stack = createStackNavigator();


export default function ProfileStackScreen({ user }) {
  const styles = createStyles();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerRight: ({ color }) => (
            <Icon
              onPress={() => navigation.push("Chat")}
              name="chatbubble-ellipses-outline"
              color={color}
              size={28}
            />
          ),
        })}
      />
      <Stack.Screen 
        name="PostsDetailScreen"
        component={PostsDetailScreen}
        options={({ navigation }) => ({
          headerShown: false,
          cardStyle: { backgroundColor: 'rgba(0, 0, 0,0.5)' },
          presentation: "transparentModal",
          gestureEnabled:false,
          transitionSpec: {
            open: {
              animation: "timing",
              config: { duration: 100, easing: Easing.bezier(0,.68,1,1) },
            },
            close: {
              animation: "timing",
              config: { duration: 100, easing: Easing.bezier(1,.02,1,.3) },
            },
          },
          headerRight: ({ color }) => (
            <Icon
              onPress={() => navigation.push("Chat")}
              name="chatbubble-ellipses-outline"
              color={color}
              size={28}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
