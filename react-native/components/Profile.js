import React, { useState } from "react";
import { Button, Text, View, Image, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import DemoJSON from "../demo/user/user01.json";
import createStyles from "../styles/styles"
import ProfilePosts from './ProfilePosts'

import {
  selectUserId,
  selectUserType,
  selectUserName,
  selectUserBio,
  selectUserPostQty,
  selectUserFollowerQty,
  selectUserFollowingQty,
  selectUserPosts,
  //selectUserFollowers,
  //selectUserFollowings
} from "../features/user/userSlice";

const Stack = createNativeStackNavigator();


function ProfileScreen({ navigation }) {
  const data = DemoJSON;
  const styles = createStyles();
  
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);
  const userName = useSelector(selectUserName);
  const userBio = useSelector(selectUserBio);
  const userPostQty = useSelector(selectUserPostQty);
  const userFollowerQty = useSelector(selectUserFollowerQty);
  const userFollowingQty = useSelector(selectUserFollowingQty);
  const userPosts = useSelector(selectUserPosts);
  //const userFollowers = useSelector(selectUserFollowers);
  //const userFollowings = useSelector(selectUserFollowings);
  const userPostsArr = [];
  for (let [index, data] of [...userPosts].reverse().entries()) {
    userPostsArr[Math.floor(index / (3 * 1))] || userPostsArr.push([]);
    userPostsArr[Math.floor(index / (3 * 1))].push(data);
  }
  while(userPostsArr[userPostsArr.length-1].length %3 !==0){
    userPostsArr[userPostsArr.length-1].push('')
  }
  return (
    <View style={styles.css.profileBody}>
      <View style={styles.css.userInformation}>
        <View style={styles.css.userInformationHeader}>
          <Image
            style={styles.css.userImage}
            source={{
              uri: "http://192.168.3.20:3000/users/" + userId + '/userimage',
            }}
          />
          <View style={styles.css.userInformationQtys}>
            <View style={styles.css.userInformationQtysComponent}>
              <Text style={[styles.css.boldFont, styles.css.informationQty]}>
                {userPostQty}
              </Text>
              <Text style={[styles.css.normalFont,{ textAlign: "center" }]}>Posts</Text>
            </View>
            <View style={styles.css.userInformationQtysComponent}>
              <Text style={[styles.css.boldFont, styles.css.informationQty]}>
                {userFollowerQty}
              </Text>
              <Text style={[styles.css.normalFont,{ textAlign: "center" }]}>Followers</Text>
            </View>
            <View style={styles.css.userInformationQtysComponent}>
              <Text style={[styles.css.boldFont, styles.css.informationQty]}>
                {userFollowingQty}
              </Text>
              <Text style={[styles.css.normalFont,{ textAlign: "center" }]}>Following</Text>
            </View>
          </View>
        </View>
        <View style={[styles.css.userInformationBio]}>
          <Text
            style={[styles.css.boldFont, styles.css.userInformationBiosComponent]}
          >
            {userId}
          </Text>
          <Text
            style={[styles.css.normalFont, styles.css.userInformationBiosComponent]}
          >
            {userBio}
          </Text>
        </View>
        <View style={[styles.css.userActions]}>
          <View style={[styles.css.userActionComponent]}>
            <Text style={styles.css.superBoldFont}>Edit Profile</Text>
          </View>
          <View style={[styles.css.userActionComponent]}>
            <Text style={styles.css.superBoldFont}>Ad Tools</Text>
          </View>
          <View style={[styles.css.userActionComponent]}>
            <Text style={styles.css.superBoldFont}>Insights</Text>
          </View>
        </View>
      </View>
      <ProfilePosts postsArr={userPostsArr} />
    </View>
  );
}

export default function ProfileStackScreen({ user }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
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
