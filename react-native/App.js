import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import store from "./app/store";
import { Provider, useSelector } from "react-redux";
import { StyleSheet, useColorScheme, Easing } from "react-native";
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
  useTheme,
} from "@react-navigation/native";
import { createStackNavigator,TransitionPresets  } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

import { fetchUser, selectUserInfoStatus } from "./features/user/userSlice"; //GetUserInfo

import ChatStackScreen from "./components/Chat";
import CommentsProvider from "./components/CommentsProvider";
import FeedActionStackScreen from "./components/FeedAction";

import HomeFeedStackScreen from "./components/HomeFeed";
import ExplorerStackScreen from "./components/Explorer";
import NewPostStackScreen from "./components/NewPost";
import ActivityStackScreen from "./components/Activity";
import ProfileStackScreen from "./components/Profile";

const TEST_USER_ID = "bot.drugs_post_office";

//THEME CONFIG

const Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0095f6",
    background: "white",
    subText: "gray",
    subButton: "#eee",
    popup: "white",
    like: "rgb(237, 73, 86)",
    warning: "#f44",
  },
};

const ThemeDark = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#0095f6",
    subButton: "#333",
    popup: "#111",
    text: "white",
    subText: "gray",
    like: "rgb(237, 73, 86)",
    warning: "#f44",
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

function HomeTabs({ navigation }) {
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

export default function App() {
  const scheme = useColorScheme();
  console.log(scheme);
  const userInfoStatus = store.getState().user.status;
  if (userInfoStatus === "idle") {
    store.dispatch(fetchUser());
  }
  //store.dispatch(fetchUser())
  return (
    <Provider store={store}>
      <NavigationContainer theme={scheme === "dark" ? ThemeDark : Theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen key="Asad" name="App" component={HomeTabs} />
          <Stack.Screen
            name="Chat"
            component={ChatStackScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: "",
              headerStyle: { height: 44 },
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
            name="Comments"
            component={CommentsProvider}
            options={({ navigation }) => ({
              headerShown: true,
              headerStyle: { height: 44 },
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
            name="FeedAction"
            component={FeedActionStackScreen}
            options={({ navigation }) => ({
              headerTransparent: false,
              cardStyle: { backgroundColor: "transparent" },
              presentation: "transparentModal",
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: { duration: 200, easing: Easing.linear  },
                },
                close: {
                  animation: "timing",
                  config: { duration: 200, easing: Easing.cubic  },
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
      </NavigationContainer>
    </Provider>
  );
}
