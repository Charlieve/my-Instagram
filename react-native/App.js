import GLOBAL from "./GLOBAL.json";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import store from "./app/store";
import { Provider, useSelector } from "react-redux";
import { StyleSheet, useColorScheme, Easing, View } from "react-native";
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
  useTheme,
} from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

import { fetchUser, selectUserInfoStatus } from "./features/user/userSlice"; //GetUserInfo

import ChatStackScreen from "./components/Chat";
import CommentsProvider from "./components/CommentsProvider";
import BottomSheetStackScreen from "./components/BottomSheet";
import ModalStackScreen from "./components/Modal";
import AnimationFeedScreen from "./components/AnimationFeed";

import HomeFeedStackScreen from "./components/HomeFeed";
import ExplorerStackScreen from "./components/Explorer";
import NewPostStackScreen from "./components/NewPost";
import ActivityStackScreen from "./components/Activity";
import ProfileStackScreen from "./components/Profile";

import Welcome from "./components/Welcome";
import Notification from "./components/Notification";

// SOCKET.IO
// import { io } from "socket.io-client";
import message from "./features/message/messageHandler";
const SOCKETCONNECT = () => {
  // const socket = io(GLOBAL.SERVERIP, { withCredentials: true });
  // console.log(socket)
  // message.test();
  message.subscript();
};

//THEME CONFIG

const Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0095f6",
    background: "white",
    notificationBody: "rgba(225,225,225,0.95)",
    subText: "gray",
    subButton: "#eee",
    popup: "white",
    like: "rgb(237, 73, 86)",
    warning: "#f44",
    smartButton: "#337bef",
    online: "#00cf00",
    chatBubble: "#7351da",
    chatBubbleOther: "#eee",
    chatBubbleGradient1: "#337bef",
    chatBubbleGradient2: "#7351da",
  },
};

const ThemeDark = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#0095f6",
    background: "black",
    notificationBody: "rgba(35,35,35,0.95)",
    card: "black",
    subButton: "#333",
    popup: "#111",
    text: "white",
    subText: "gray",
    like: "rgb(237, 73, 86)",
    warning: "#f44",
    smartButton: "#337bef",
    online: "#00cf00",
    chatBubble: "#7351da",
    chatBubbleOther: "#111",
    chatBubbleGradient1: "#337bef",
    chatBubbleGradient2: "#7351da",
  },
};

const styles = StyleSheet.create({
  asd: {
    backgroundColor: "red",
    color: "blue",
  },
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="HomeFeed"
        component={HomeFeedStackScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={"home" + (focused ? "" : "-outline")}
              color={color}
              size={size * 1.1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explorer"
        component={ExplorerStackScreen}
        style={styles.asd}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={"search" + (focused ? "" : "-outline")}
              color={color}
              size={size * 1.1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NewPost"
        component={NewPostStackScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={"add-circle" + (focused ? "" : "-outline")}
              color={color}
              size={size * 1.1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityStackScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={"heart" + (focused ? "" : "-outline")}
              color={color}
              size={size * 1.1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={"person-circle" + (focused ? "" : "-outline")}
              color={color}
              size={size * 1.1}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App1() {
  const scheme = useColorScheme();
  const userInfoStatus = useSelector(selectUserInfoStatus);
  useEffect(() => {
    SOCKETCONNECT();
  }, []);

  if (userInfoStatus === "idle") {
    // store.dispatch(fetchUser());
    return (
      <NavigationContainer theme={scheme === "dark" ? ThemeDark : Theme}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor:
              scheme === "dark"
                ? ThemeDark.colors.background
                : Theme.colors.background,
          }}
        >
          <View style={{ flex: 1, maxWidth: 800 }}>
            <Welcome />
          </View>
        </View>
      </NavigationContainer>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor:
            scheme === "dark" ? ThemeDark.colors.border : Theme.colors.border,
        }}
      >
        <View style={{ flex: 1, maxWidth: 800 }}>
          <NavigationContainer theme={scheme === "dark" ? ThemeDark : Theme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen key="mainPage" name="App" component={HomeTabs} />
              <Stack.Screen name="Chat" component={ChatStackScreen} />
              <Stack.Screen
                name="Comments"
                component={CommentsProvider}
                options={({ navigation }) => ({
                  headerShown: true,
                  headerStyle: { height: 64 },
                  headerLeft: () => (
                    <Icon
                      onPress={() => navigation.goBack()}
                      name="chevron-back"
                      color={
                        scheme === "dark"
                          ? ThemeDark.colors.text
                          : Theme.colors.text
                      }
                      size={40}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="BottomSheet"
                component={BottomSheetStackScreen}
                options={({ navigation }) => ({
                  headerTransparent: false,
                  cardStyle: { backgroundColor: "transparent" },
                  presentation: "transparentModal",
                  transitionSpec: {
                    open: {
                      animation: "timing",
                      config: { duration: 200, easing: Easing.linear },
                    },
                    close: {
                      animation: "timing",
                      config: { duration: 200, easing: Easing.cubic },
                    },
                  },
                  headerLeft: ({ color }) => (
                    <Icon
                      onPress={() => navigation.goBack()}
                      name="chevron-back"
                      color={color}
                      size={40}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="Modal"
                component={ModalStackScreen}
                options={({ navigation }) => ({
                  headerTransparent: false,
                  headerMode: "screen",
                  cardStyle: { backgroundColor: "transparent" },
                  presentation: "modal",
                  headerLeft: ({ color }) => (
                    <Icon
                      onPress={() => navigation.goBack()}
                      name="chevron-back"
                      color={color}
                      size={40}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="AnimationFeed"
                component={AnimationFeedScreen}
                options={({ navigation }) => ({
                  headerTransparent: false,
                  cardStyle: { backgroundColor: "transparent" },
                  presentation: "transparentModal",
                  gestureEnabled: false,
                  transitionSpec: {
                    open: {
                      animation: "timing",
                      config: { duration: 0, easing: Easing.linear },
                    },
                    close: {
                      animation: "timing",
                      config: { duration: 100, easing: Easing.exp },
                    },
                  },
                  headerLeft: ({ color }) => (
                    <Icon
                      onPress={() => navigation.goBack()}
                      name="chevron-back"
                      color={color}
                      size={40}
                    />
                  ),
                })}
              />
            </Stack.Navigator>
            <Notification />
          </NavigationContainer>
        </View>
      </View>
    );
  }
}

export default function App() {
  return (
    <Provider store={store}>
      <App1 />
    </Provider>
  );
}
