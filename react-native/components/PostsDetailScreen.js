import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
  PanResponder,
} from "react-native";
import PostsDetailContainer from "./PostsDetailContainer";
import createStyles from "../styles/styles";
import PostsDetailInitialPost from "./PostsDetailInitialPost";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

export default function PostsDetailScreen({ route }) {
  const navigation = useNavigation();
  const styles = createStyles();
  const { measure, postData, postId, authorId, previewMeasure } = route.params;
  const previewMeasureChecked = previewMeasure ? previewMeasure : measure;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const mainView = useRef(null);
  const progress = useRef(new Animated.Value(previewMeasure ? 2 : 0)).current;
  const panValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [startPanning, setStartPanning] = useState(false);
  const [allowPanning, setAllowPanning] = useState(true);
  const [scrollable, setScrollable] = useState(true);
  const scrollResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      if (
        (gestureState.dx === 0 && gestureState.dy === 0) ||
        gestureState.vx > 80
      ) {
        setScrollable(true);
      } else {
        if (gestureState.dx > Math.abs(gestureState.dy) * 1.2) {
          setScrollable(false);
          return true;
        } else {
          setScrollable(true);
        }
      }
    },

    onPanResponderGrant: () => {
      setScrollable(false);
    },

    onPanResponderMove: Animated.event(
      [null, { dx: panValue.x, dy: panValue.y }],
      { useNativeDriver: false }
    ),

    onPanResponderRelease: (evt, gestureState) => {
      setScrollable(true);
      if (
        Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) >
          200 ||
        gestureState.vx > 0.8
      ) {
        Animated.timing(progress, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
          easing: Easing.bezier(0, 0.51, 0.33, 1),
        }).start();
        mainView.current.scrollTo({ x: 0, y: 0, animated: false });
        setTimeout(() => navigation.goBack(), 250);
      } else {
        Animated.spring(panValue, {
          toValue: { x: 0, y: 0 },
          tension: 80,
          friction: 9,
          useNativeDriver: false,
        }).start();
      }
    },
    onShouldBlockNativeResponder: () => true,
  });
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.quad,
    }).start();

    const unsubscribe = navigation.addListener("gestureStart", (e) => {
      // console.log(e);
      // console.log(navigation);
      // setStartPanning(true);
      // PanResponder.onPanResponderMove = () => true;
      // console.log(startPanning);
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <Animated.View
      style={[
        { flex: 1 },
        {
          opacity: progress.interpolate({
            inputRange: [0, 0.3, 0.4, 1],
            outputRange: [1, 1, 1, 1],
          }),
          transform: [
            {
              translateX: Animated.add(
                progress.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    -windowWidth / 2 + measure.x + measure.width / 2,
                    0,
                    -windowWidth / 2 +
                      previewMeasureChecked.x +
                      previewMeasureChecked.width / 2,
                  ],
                }),
                Animated.multiply(progress, panValue.x).interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                })
              ),
            },
            {
              translateY: Animated.add(
                progress.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    measure.y -
                      ((1 - measure.width / windowWidth) * windowHeight) / 2 +
                      10 +
                      ((2 / 3 - measure.width / windowWidth) * measure.width) /
                        6,
                    0,
                    previewMeasureChecked.y -
                      ((1 - previewMeasureChecked.width / windowWidth) *
                        windowHeight) /
                        2 +
                      10 +
                      ((2 / 3 - previewMeasureChecked.width / windowWidth) *
                        previewMeasureChecked.width) /
                        6 +
                      60,
                  ],
                }),
                Animated.multiply(progress, panValue.y).interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                })
              ),
            },
            {
              scale: Animated.add(
                progress.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    measure.width / windowWidth,
                    1,
                    previewMeasureChecked.width / windowWidth,
                  ],
                }),
                Animated.multiply(progress, panValue.x).interpolate({
                  inputRange: [-1, 0, 100, 500],
                  outputRange: [0, 0, -0.03, -0.04],
                  ease: Easing.easeOut,
                })
              ),
            },
          ],
        },
      ]}
    >
      <Animated.View
        style={{
          backgroundColor: styles.colors.background,
          paddingTop: 20,
          borderRadius: Animated.add(
            progress.interpolate({
              inputRange: [0, 0.9, 1],
              outputRange: [0, 0, 0],
            }),
            Animated.multiply(
              progress,
              panValue.x.interpolate({
                inputRange: [-1, 0, 100, 101],
                outputRange: [-1, 0, 20, 20],
                easing: Easing.easeOut,
              })
            )
          ),
          height: progress.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [
              (windowWidth / (windowHeight - 38)) * 100 + "%",
              "100%",
              (windowWidth / (windowHeight - 38)) * 100 + "%",
            ],
          }),
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            marginTop: progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [-130, 0, -130],
            }),
          }}
        />
        <View style={styles.css.custumizeHeader}>
          <Icon
            onPress={() => {
              Animated.timing(progress, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
                easing: Easing.bezier(0, 0.51, 0.33, 1),
              }).start();
              mainView.current.scrollTo({ x: 0, y: 0, animated: false });
              setTimeout(() => navigation.goBack(), 250);
            }}
            name="chevron-back"
            color={styles.colors.text}
            size={40}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.css.subFont, styles.css.subBoldFont]}>
              {authorId}
            </Text>
            <Text style={[styles.css.boldFont, { fontSize: 16 }]}>Posts</Text>
          </View>
          <Icon
            name="chevron-back"
            size={40}
            color={styles.colors.background}
          />
        </View>
        <ScrollView
          style={{ backgroundColor: styles.colors.background }}
          scrollEnabled={scrollable}
          canCancelContentTouches={scrollable}
          disableScrollViewPanResponder={true}
          onTouchEnd={() => {
            setScrollable(true);
          }}
          ref={mainView}
        >
          <View {...scrollResponder.panHandlers}>
            <PostsDetailInitialPost
              postId={postId}
              postData={postData}
              authorId={authorId}
            />
            {/* <PostsDetailContainer navigation={navigation}/> */}
          </View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}
