import * as React from "react";
import { Button, Text, View, Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Logo from "../logo/instagram-logo";
import createStyles from "../styles/styles";

import FeedsContainer from "./FeedsContainer";
import OtherUserProfileScreen from "./OtherUserProfileScreen";

const Stack = createNativeStackNavigator();

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
    <Stack.Navigator
      ScreenOptions={()=>({animationTypeForReplace : 'pop'})}>
      <Stack.Screen
        name="HomeFeedScreen"
        component={HomeFeedScreen}
        options={({ navigation }) => ({
          headerTitle: "",
          headerStyle: { height: 44 },
          headerLeft: () => <Logo fillcolor={styles.colors.text} />,
          headerRight: () => (
            <Icon
              onPress={() => navigation.push("Chat")}
              name="chatbubble-ellipses-outline"
              color={styles.colors.text}
              size={28}
            />
          ),
        })}
      />
      <Stack.Screen
        name="OtherUserProfileScreen"
        component={OtherUserProfileScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: route.params.userId,
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 14},
          headerStyle: { height: 44 },
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
