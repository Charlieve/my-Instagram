import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Animated,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const PostThumbnail = ({ postData, postId, authorId, style }) => {
  const navigation = useNavigation();
  const progress = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get("screen").width / 3 - 1;
  const thumbnail = useRef(null);
  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(progress, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }).start();
      return () => {};
    }, [])
  );
  // useEffect(() => {
  //   if (testRef) {
  //     testRef.current.measureInWindow((x, y, width, height) => {
  //       setMeasure({ x, y, width, height });
  //     });
  //   }
  // }, []);
  return (
    <View style={style} ref={thumbnail}>
      <Animated.View
        style={[
          {
            width: "100%",
            position: "absolute",
            aspectRatio: 1,
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
          {
            transform: [
              {
                scale: press.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.9],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable
          style={{
            flex: 1,
          }}
          onPress={() => {
            thumbnail.current.measureInWindow((x, y, width, height) => {
              const measure = { x, y, width, height };
              navigation.push("PostsDetailScreen", {
                measure,
                postData,
                postId,
                authorId,
              });
            });
            Animated.timing(progress, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() =>
            Animated.timing(press, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start()
          }
          delayLongPress={300}
          onLongPress={() => {
            Animated.sequence([
              Animated.timing(press, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.parallel([
                Animated.timing(press, {
                  toValue: 0,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(progress, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]),
            ]).start();
            setTimeout(() => {
              thumbnail.current.measureInWindow((x, y, width, height) => {
                const measure = { x, y, width, height };
                navigation.push("AnimationFeed", {
                  measure,
                  postData,
                  postId,
                  authorId,
                });
              });
            }, 150);
          }}
        >
          <Image
            style={{
              flex: 1,
            }}
            source={{
              uri: postData
                ? "data:image/png;base64," + postData
                : "http://192.168.3.20:3000/post/" +
                  postId +
                  "/content.jpeg",
            }}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default PostThumbnail;
