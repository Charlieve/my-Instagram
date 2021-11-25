import GLOBAL from "../GLOBAL.json";
import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Easing,
  View,
  Text,
  Pressable,
  StyleSheet,
  PanResponder,
  Image,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";

import createStyles from "../styles/styles";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

export default function AnimationFeedScreen({ navigation, route }) {
  const styles = createStyles();
  const progress = useRef(new Animated.Value(0)).current;
  const panValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const listShow = useRef(new Animated.Value(1)).current;
  const windowWidth =
    Dimensions.get("window").width > 800 ? 800 : Dimensions.get("window").width;
  const { measure, postData, postId, authorId, currentStack } = route.params;
  const offsetX = (windowWidth / 3) * 0.2 - measure.x;
  const offsetY = 40 - measure.y;

  const imageSrc = postData
    ? "data:image/png;base64," + postData
    : `${GLOBAL.SERVERIP}/post/${postId}/content.jpeg`;
  const panValueResponder = useRef(
    PanResponder.create({
      //onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (event, gestureState) =>
        (gestureState.dx !== 0 || gestureState.dy !== 0) && true,
      onPanResponderMove: Animated.event(
        [null, { dx: panValue.x, dy: panValue.y }],
        {
          listener: (event, gestureState) => {
            if (listShow._value > 0.01) {
              if (gestureState.dy > 80) {
                Animated.timing(listShow, {
                  toValue: 0,
                  duration: 800,
                  useNativeDriver: false,
                  easing: Easing.out(Easing.exp),
                }).start();
              }
            } else {
              if (gestureState.dy < 30) {
                Animated.timing(listShow, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: false,
                  easing: Easing.out(Easing.exp),
                }).start();
              }
            }
          },
          useNativeDriver: false,
        }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 400 || gestureState.vy > 0.8) {
          Animated.timing(progress, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
            easing: Easing.in(Easing.elastic(0.8)),
          }).start();
          setTimeout(() => navigation.goBack(), 200);
        } else {
          Animated.timing(panValue, {
            toValue: { x: 0, y: 0 },
            duration: 500,
            useNativeDriver: false,
            easing: Easing.out(Easing.exp),
          }).start();
          Animated.timing(listShow, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
            easing: Easing.out(Easing.exp),
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.in(Easing.elastic(0.8)),
    }).start();
  });
  return (
    <BlurView
      style={{
        flex: 1,
      }}
      intensity={0}
      tint="dark"
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "black",
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
          },
        ]}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            Animated.timing(progress, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
              easing: Easing.in(Easing.elastic(0.8)),
            }).start();
            setTimeout(() => navigation.goBack(), 200);
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          {
            width: (windowWidth / 3) * 2.6,
            height: (windowWidth / 3) * 2.6 + 50,
            position: "absolute",
            top: measure.y,
            left: measure.x,
            overflow: "hidden",
          },
          {
            borderRadius: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 15],
            }),
            transform: [
              {
                translateY: Animated.add(
                  progress.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [
                      -(windowWidth / 3) * 0.8 - 35,
                      -(windowWidth / 3) * 0.8 - 35,
                      offsetY,
                    ],
                  }),
                  Animated.multiply(progress, panValue.y).interpolate({
                    inputRange: [-300, -200, -100, 0, 100],
                    outputRange: [-10, -8, -5, 0, 90],
                  })
                ),
              },
              {
                translateX: Animated.add(
                  progress.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [
                      -(windowWidth / 3) * 0.8,
                      -(windowWidth / 3) * 0.8,
                      offsetX,
                    ],
                  }),
                  Animated.multiply(progress, panValue.x).interpolate({
                    inputRange: [-150, -100, 0, 100, 150],
                    outputRange: [-20, -13, 0, 13, 20],
                  })
                ),
              },
              {
                scale: Animated.add(
                  progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1 / 2.6, 1],
                  }),
                  Animated.multiply(progress, panValue.y).interpolate({
                    inputRange: [-300, -200, -100, 0, 100],
                    outputRange: [-0.09, -0.08, -0.05, 0, -0.05],
                  })
                ),
              },
            ],
          },
        ]}
        {...panValueResponder.panHandlers}
      >
        <Pressable
          style={{ height: "100%" }}
          onPress={() => {
            navigation.goBack();
            navigation.push(currentStack + "PostsDetailScreen", {
              measure,
              postData,
              postId,
              authorId,
            });
          }}
        >
          <Animated.View
            style={[
              styles.css.feedAnimationPreviewHeader,
              {
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              style={{
                height: "100%",
                aspectRatio: 1,
                borderRadius: 50,
                marginRight: 10,
              }}
              source={{
                uri: GLOBAL.SERVERIP + "/users/" + authorId + "/userimage.png",
              }}
            />
            <Text style={styles.css.normalFont}>{authorId}</Text>
          </Animated.View>
          <Image
            style={{
              flex: 1,
            }}
            source={{ uri: imageSrc }}
          />
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[
          {
            width: (windowWidth / 3) * 1.8,
            backgroundColor: styles.colors.subButton,
            position: "absolute",
            top: (windowWidth / 3) * 2.6 + 100,
            left: measure.x + (windowWidth / 3 - measure.x * 3) * 0.2,
            borderRadius: 10,
          },
          {
            opacity: Animated.add(
              progress.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0, 1],
              }),
              Animated.multiply(progress, listShow).interpolate({
                inputRange: [0, 1, 2],
                outputRange: [-1.2, 0, 0],
              })
            ),
            transform: [
              {
                translateY: Animated.add(
                  Animated.add(
                    progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        measure.y - ((windowWidth / 3) * 2.6 + 100) + 60,
                        0,
                      ],
                    }),
                    Animated.multiply(progress, panValue.y).interpolate({
                      inputRange: [-300, -200, -100, 0, 100],
                      outputRange: [-10, -8, -5, 0, 100],
                    })
                  ),
                  Animated.multiply(progress, listShow).interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [-120, 0, 0],
                  })
                ),
              },
              {
                translateX: Animated.add(
                  progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      ((windowWidth / 3 - measure.x) / (windowWidth / 3)) *
                        ((windowWidth / 3) * -0.8),
                      0,
                    ],
                  }),
                  Animated.multiply(progress, listShow).interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [
                      ((windowWidth / 3 - measure.x) / (windowWidth / 3)) *
                        ((windowWidth / 3) * -0.8),
                      0,
                      0,
                    ],
                  })
                ),
              },
              {
                scale: Animated.add(
                  progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1 / 2.6, 1],
                  }),
                  Animated.multiply(progress, listShow).interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [-1, 0, 0],
                  })
                ),
              },
            ],
          },
        ]}
      >
        <Pressable style={styles.css.feedAnimationActionListButton}>
          <Text style={{ fontSize: 16, color: styles.colors.text }}>Like</Text>
        </Pressable>
        <View
          style={{
            flex: 1,
            height: 0.5,
            backgroundColor: styles.colors.subText,
          }}
        />
        <Pressable style={styles.css.feedAnimationActionListButton}>
          <Text style={{ fontSize: 16, color: styles.colors.text }}>
            View Profile
          </Text>
        </Pressable>
        <View
          style={{
            flex: 1,
            height: 0.5,
            backgroundColor: styles.colors.subText,
          }}
        />
        <Pressable style={styles.css.feedAnimationActionListButton}>
          <Text style={{ fontSize: 16, color: styles.colors.text }}>
            Send as Message
          </Text>
        </Pressable>
        <View
          style={{
            flex: 1,
            height: 0.5,
            backgroundColor: styles.colors.subText,
          }}
        />
        <Pressable style={styles.css.feedAnimationActionListButton}>
          <Text style={{ fontSize: 16, color: styles.colors.warning }}>
            Report
          </Text>
        </Pressable>
        <View
          style={{
            flex: 1,
            height: 0.5,
            backgroundColor: styles.colors.subText,
          }}
        />
        <Pressable style={styles.css.feedAnimationActionListButton}>
          <Text style={{ fontSize: 16, color: styles.colors.warning }}>
            Not interested
          </Text>
        </Pressable>
      </Animated.View>
    </BlurView>
  );
}
