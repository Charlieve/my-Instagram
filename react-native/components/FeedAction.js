import React from "react";
import { Animated,View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useCardAnimation } from '@react-navigation/stack';

import createStyles from "../styles/styles";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

export default function FeedActionStackScreen({ navigation }) {
  const styles = createStyles();
  const { current } = useCardAnimation();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column-reverse",
      }}
    >
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0, 0, 0, 0.3)" },
        ]}
        onPress={navigation.goBack}
      />
      <Animated.View style={[styles.css.actionContainer,{
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 1],
                extrapolate: 'clamp',
              }),
            },
          ],}]}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
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
              <Text style={styles.css.normalFont}>
                User Profile
              </Text>
            </Pressable>
            <Pressable style={styles.css.actionListButton}>
              <Text style={styles.css.normalFont}>
                Follow
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
