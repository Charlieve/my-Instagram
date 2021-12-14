import GLOBAL from "../GLOBAL.json";
import React, { useState, useRef, useEffect } from "react";
import {
  FlatList,
  Image,
  Animated,
  Easing,
  View,
  Text,
  Pressable,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useCardAnimation } from "@react-navigation/stack";

import createStyles from "../styles/styles";

import { selectUserId } from "../features/user/userSlice";
import axios from "axios";
import store from "../app/store";
import { useSelector } from "react-redux";
import { fetchUser, selectUserInfoStatus } from "../features/user/userSlice";
import { fetchMessage, offloadMessage } from "../features/message/messageSlice";

export default function ModalStackScreen({ navigation }) {
  const styles = createStyles();
  const bottomSheet = useRef(new Animated.ValueXY({ x: 0, y: 500 })).current;
  const bottomSheetResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: bottomSheet.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.vy > 0.8) {
          Animated.timing(bottomSheet, {
            toValue: { x: 0, y: 500 },
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
          }).start();
          navigation.goBack();
        } else {
          Animated.timing(bottomSheet, {
            toValue: { x: 0, y: 0 },
            duration: 500,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
          }).start();
        }
      },
    })
  ).current;

  const [bots, setBots] = useState();
  const botSelecter = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          store.dispatch(offloadMessage())
          store.dispatch(fetchUser(item.id));
          store.dispatch(fetchMessage(item.id));
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            alignItems: "center",
            margin: 5,
          }}
        >
          <Image
            style={{
              height: "100%",
              aspectRatio: 1,
              borderRadius: 50,
            }}
            source={{
              uri: `${GLOBAL.SERVERIP}/users/${item.id}/userimage.png`,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    Animated.timing(bottomSheet, {
      toValue: { x: 0, y: 0 },
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    console.log(bottomSheet.y);
    (async () => {
      const getBots = await axios.get(GLOBAL.SERVERIP + "/api/bots");
      const botsArr = [];
      for (let bot of getBots.data) {
        botsArr.push({ id: bot.userId });
      }
      console.log(botsArr);
      setBots(botsArr);
    })();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column-reverse",
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          // {
          //   backgroundColor: "white",
          //   opacity: bottomSheet.y.interpolate({
          //     inputRange: [-1, 0, 300,301],
          //     outputRange: [0.7, 0.7, 0,0],
          //   }),
          // },
        ]}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            Animated.timing(bottomSheet, {
              toValue: { x: 0, y: 500 },
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.out(Easing.exp),
            }).start();
            navigation.goBack();
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.css.actionContainer,
          {
            transform: [
              {
                translateY: bottomSheet.y.interpolate({
                  inputRange: [-10, 0, 5],
                  outputRange: [-2, 0, 4],
                }),
              },
            ],
          },
        ]}
        {...bottomSheetResponder.panHandlers}
      >
        <View style={styles.css.actionTipsBar} />
        <Text style={styles.css.boldFont}>Switch Account</Text>

        <View
          style={{
            width: "100%",
            overflow: "hidden",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <FlatList
            data={bots}
            renderItem={botSelecter}
            keyExtractor={(item, index) => "bot" + index}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </Animated.View>
    </View>
  );
}
