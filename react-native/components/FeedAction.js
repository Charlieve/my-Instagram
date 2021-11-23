import React, { useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  View,
  Text,
  Pressable,
  StyleSheet,
  PanResponder,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useCardAnimation } from "@react-navigation/stack";

import createStyles from "../styles/styles";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

export default function FeedActionStackScreen({ navigation }) {
  const styles = createStyles();
  const bottomSheet = useRef(new Animated.ValueXY({ x: 0, y: 500 })).current;
  const bottomSheetResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
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
  useEffect(() => {
    Animated.timing(bottomSheet, {
      toValue: { x: 0, y: 0 },
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    console.log(bottomSheet.y);
  }),
    [];
  // const { current } = useCardAnimation();
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
          {
            backgroundColor: "black",
            opacity: bottomSheet.y.interpolate({
              inputRange: [-1, 0, 300,301],
              outputRange: [0.7, 0.7, 0,0],
            }),
          },
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
        <View style={{width:"100%", flexDirection: "row", justifyContent: "space-around" }}>
          <Pressable style={styles.css.actionButton}>
            <Icon name="share-outline" color={styles.colors.text} size={26} />
            <Text
              style={[styles.css.normalFont, { fontSize: 12, marginTop: 4 }]}
            >
              Share to...
            </Text>
          </Pressable>
          <Pressable style={styles.css.actionButton}>
            <Icon name="link-outline" color={styles.colors.text} size={26} />
            <Text
              style={[styles.css.normalFont, { fontSize: 12, marginTop: 4 }]}
            >
              Copy link
            </Text>
          </Pressable>
          <Pressable style={styles.css.actionButton}>
            <Icon
              name="warning-outline"
              color={styles.colors.warning}
              size={26}
            />
            <Text
              style={[
                styles.css.normalFont,
                { fontSize: 12, marginTop: 4, color: styles.colors.warning },
              ]}
            >
              Report
            </Text>
          </Pressable>
        </View>
        <View style={{ width: "100%", padding: 5, flexDirection: "row" }}>
          <View style={styles.css.actionList}>
            <Pressable style={styles.css.actionListButton}>
              <Text style={styles.css.normalFont}>User Profile</Text>
            </Pressable>
            <Pressable style={styles.css.actionListButton}>
              <Text style={styles.css.normalFont}>Follow</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
