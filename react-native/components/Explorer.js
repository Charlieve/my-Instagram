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
  Easing,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import FeedsDetailContainer from "./FeedsDetailContainer";
import Icon from "react-native-vector-icons/Ionicons";
import DemoJSON from "../demo/explorer/explorer01.json";
import axios from "axios";
import { BlurView } from "expo-blur";
import PostThumbnail from "./PostThumbnail"
import PostsDetailScreen from "./PostsDetailScreen"

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  feeds: {
    width: "100%",
  },
  feedRow: {
    width: "100%",
    flexDirection: "column",
    flexWrap: "wrap",
    alignContent: "space-between",
    marginBottom: 0.5
  },
  feedRowBig: {
    width: "100%",
    flexDirection: "column",
    flexWrap: "wrap",
    alignContent: "space-between",
    marginBottom: 1,
  },
  feedComponent: {
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
  const [componentWidth,setComponentWidth] = useState(Math.min(800,Dimensions.get('window').width))
  return (
    <View
      style={[styles.feedRow,
        feedsRowData[0].firstFeedType === "image"
          ? {height: componentWidth/3}
          : {height: componentWidth/3*2}
        ]}
        onLayout={(event) => {
          setComponentWidth(event.nativeEvent.layout.width)
        }}
    >
      <FeedComponent feedData={feedsRowData[0]} navigation={navigation} componentWidth={componentWidth}/>
      <FeedComponent feedData={feedsRowData[1]} navigation={navigation} componentWidth={componentWidth} />
      <FeedComponent feedData={feedsRowData[2]} navigation={navigation} componentWidth={componentWidth} />
    </View>
  );
}

function FeedComponent({ feedData, navigation, componentWidth }) {
  return (
    <PostThumbnail
      postId={feedData.postId}
      authorId={feedData.postByUserId}
      style = {[styles.feedComponent,
        feedData.firstFeedType === "image"
          ? {width: componentWidth/3 -1,height: componentWidth/3 -1}
          : {width: componentWidth/3*2 -1 ,height: componentWidth/3*2 -1}
      ]}
    />
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
        name="ExploreScreen"
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
