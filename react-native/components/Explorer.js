import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedsDetailContainer from "./FeedsDetailContainer";
import Icon from "react-native-vector-icons/Ionicons";
import DemoJSON from "../demo/explorer/explorer01.json";
import axios from "axios";
import { BlurView } from "expo-blur";

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  feeds: {
    width: "100%",
  },
  feedRow: {
    width: "100%",
    flexDirection: "column",
    flexWrap: "wrap",
    height: Dimensions.get("window").width / 3,
    alignContent: "space-between",
    marginBottom: 1,
  },
  feedRowBig: {
    width: "100%",
    flexDirection: "column",
    flexWrap: "wrap",
    height: (Dimensions.get("window").width / 3) * 2,
    alignContent: "space-between",
    marginBottom: 1,
  },
  feedComponent: {
    width: Dimensions.get("window").width / 3 - 1,
    height: Dimensions.get("window").width / 3 - 1,
    aspectRatio: 1,
    marginBottom: 1,
    backgroundColor: "black",
  },
  feedComponentBig: {
    width: (Dimensions.get("window").width / 3) * 2 - 1,
    height: (Dimensions.get("window").width / 3) * 2 - 1,
    marginBottom: 1,
    backgroundColor: "black",
  },
});

function Feeds({ feedsData, navigation }) {
  return (
    <View style={styles.feeds}>
      <FeedRow feedsRowData={feedsData.feedRow01} navigation={navigation} />
      <FeedRow feedsRowData={feedsData.feedRow02} navigation={navigation} />
      <FeedRow feedsRowData={feedsData.feedRow03} navigation={navigation} />
    </View>
  );
}

function FeedRow({ feedsRowData, navigation }) {
  return (
    <View
      style={
        feedsRowData[0].firstFeedType === "image"
          ? styles.feedRow
          : styles.feedRowBig
      }
    >
      <FeedComponent feedData={feedsRowData[0]} navigation={navigation} />
      <FeedComponent feedData={feedsRowData[1]} navigation={navigation} />
      <FeedComponent feedData={feedsRowData[2]} navigation={navigation} />
    </View>
  );
}

function FeedComponent({ feedData, navigation }) {
  const [blur, setBlur] = useState(0);
  return (
    <View
      style={
        feedData.firstFeedType === "image"
          ? styles.feedComponent
          : styles.feedComponentBig
      }
    >
      <BlurView intensity={100} style={{ flex: 1 }}>
        <Pressable
          style={{ flex: 1 }}
          //onPress={() => navigation.navigate("FeedsDetail")}
          onPress={() => {
            setBlur(100);
            console.log("press");
          }}
        >
          <Image
            style={{ flex: 1 }}
            source={{
              uri:
                "http://192.168.3.20:3000/post/" + feedData.postId + "/content",
            }}
          />
        </Pressable>
      </BlurView>
    </View>
  );
}

function ExplorerScreen({ navigation }) {
  const [data, setData] = useState([DemoJSON]);
  const onEndReachedAction = async () => {
    const fetchData = (await axios.get("http://192.168.3.20:3000/api/explore"))
      .data;
    setData([...data, fetchData]);
  };
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Feeds feedsData={item} navigation={navigation} />
      )}
      initialNumToRender={1}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        onEndReachedAction();
      }}
      onRefresh={() => {
        setData([DemoJSON]);
      }}
      refreshing={false}
    />
  );
}

export default function ExplorerStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ExplorerScreen}
        options={({ navigation }) => ({
          headerTitle: "",
          headerStyle: { height: 44 },
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
        name="FeedsDetail"
        component={FeedsDetailContainer}
        options={({ navigation }) => ({
          headerTitle: "",
          headerStyle: { height: 44 },
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
