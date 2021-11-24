import * as React from "react";
import { Button, Text, View, Image, Easing } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Logo from "../logo/instagram-logo";
import createStyles from "../styles/styles";

import FeedsContainer from "./FeedsContainer";
import OtherUserProfileScreen from "./OtherUserProfileScreen";
import PostsDetailScreen from "./PostsDetailScreen";

const Stack = createStackNavigator();

function HomeFeedScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <FeedsContainer navigation={navigation} />
    </View>
  );
}

export default function HomeFeedStackScreen() {
  const styles = createStyles();
  return (
    <Stack.Navigator ScreenOptions={() => ({ animationTypeForReplace: "pop" })}>
      <Stack.Screen
        name="HomeFeedScreen"
        component={HomeFeedScreen}
        options={({ navigation }) => ({
          headerTitle: "",
          headerStyle: { height: 64 },
          headerLeft: () => (
            <Logo fillcolor={styles.colors.text} style={{ marginLeft: 10 }} />
          ),
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <Icon
                onPress={() => navigation.push("Chat")}
                name="chatbubble-ellipses-outline"
                color={styles.colors.text}
                size={28}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="HomeFeedOtherUserProfileScreen"
        component={OtherUserProfileScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: route.params.userId,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 14 },
          headerStyle: { height: 60 },
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
        name="HomeFeedPostsDetailScreen"
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
    </Stack.Navigator>
  );
}
