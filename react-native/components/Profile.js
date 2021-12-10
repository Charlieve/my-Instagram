import React, { useState } from "react";
import { View, Text, Easing, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import ProfileScreen from "./ProfileScreen";
import PostsDetailScreen from "./PostsDetailScreen";
import createStyles from "../styles/styles";
import OtherUserProfileScreen from "./OtherUserProfileScreen";
import FollowTab from "./FollowTab";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

const Stack = createStackNavigator();

export default function ProfileStackScreen({ user }) {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: useSelector(selectUserId),
          header: () => (
            <View
              style={[
                styles.css.custumizeHeader,
                {
                  height: 64,
                  alignItems: "flex-end",
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 8,
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
                onPress={()=>navigation.push('Modal')}
              >
                <Text
                  style={[styles.css.custumizeHeaderTitle, { marginRight: 5 }]}
                >
                  {useSelector(selectUserId)}
                </Text>
                <Icon
                  name="chevron-down-outline"
                  color={styles.colors.text}
                  size={16}
                />
              </TouchableOpacity>
            </View>
          )
        })}
      />
      <Stack.Screen
        name="ProfileOtherUserProfileScreen"
        component={OtherUserProfileScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: route.params.userId,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 14 },
          headerStyle: { height: 64 },
          headerLeft: () => (
            <Icon
              onPress={() => navigation.goBack()}
              name="chevron-back"
              color={styles.colors.text}
              size={40}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ProfilePostsDetailScreen"
        component={PostsDetailScreen}
        options={({ navigation }) => ({
          headerShown: false,
          cardStyle: { backgroundColor: "rgba(0, 0, 0,0.5)" },
          presentation: "transparentModal",
          gestureEnabled: false,
          transitionSpec: {
            open: {
              animation: "timing",
              config: { duration: 100, easing: Easing.bezier(0, 0.68, 1, 1) },
            },
            close: {
              animation: "timing",
              config: { duration: 100, easing: Easing.bezier(1, 0.02, 1, 0.3) },
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
      <Stack.Screen
        name='FollowTab'
        component={FollowTab}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: route.params.userId,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 14 },
          headerStyle: { height: 64 },
          headerLeft: () => (
            <Icon
              onPress={() => navigation.goBack()}
              name="chevron-back"
              color={styles.colors.text}
              size={40}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
