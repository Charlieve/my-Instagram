import GLOBAL from "../GLOBAL.json";
import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import createStyles from "../styles/styles";

import store from "../app/store";
import {
  selectUserFollowings,
  followUser,
} from "../features/user/userSlice";

const Follower = ({ item }) => {
  const dispatch = useDispatch();
  const styles = createStyles();
  const followingUserId = item.item;
  const followings = useSelector(selectUserFollowings);
  const isFollowed = followings.includes(followingUserId);
  return (
    <View
      style={{
        flex: 1,
        height: 50,
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
      }}
    >
      <Image
        style={{ aspectRatio: 1, height: "100%", borderRadius: 50 }}
        source={{
          uri: GLOBAL.SERVERIP + "/users/" + followingUserId + "/userimage.png",
        }}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 10,
          marginRight: 10,
          justifyContent: "center",
        }}
      >
        <Text style={styles.css.boldFont}>{item.item}</Text>
      </View>

      <TouchableOpacity
        style={
          isFollowed
            ? [
                styles.css.userActionComponent,
                {
                  flex: 0,
                  width:110,
                  height: 30,
                  padding: 5,
                  paddingLeft: 20,
                  paddingRight: 20,
                  justifyContent: "center",
                  borderColor: styles.colors.border,
                },
              ]
            : [styles.css.userActionComponentActivated,
              {
                flex: 0,
                width:110,
                height: 30,
                padding: 5,
                paddingLeft: 20,
                paddingRight: 20,
                justifyContent: "center",
              }]
        }
        onPress={() => {
          dispatch(followUser(followingUserId));
        }}
      >
        <Text style={styles.css.superBoldFont}>
          {isFollowed ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
      {/* {isFollowed ? (
        <TouchableOpacity
          style={[
            styles.css.userActionComponent,
            {
              flex: 0,
              height: 30,
              padding: 5,
              paddingLeft: 20,
              paddingRight: 20,
              justifyContent: "center",
              borderColor: styles.colors.border,
            },
          ]}
        >
          <Text style={styles.css.superBoldFont}>Following</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.css.userActionComponentActivated,
            {
              flex: 0,
              height: 30,
              padding: 5,
              paddingLeft: 20,
              paddingRight: 20,
              justifyContent: "center",
              borderColor: styles.colors.border,
            },
          ]}
        >
          <Text style={styles.css.superBoldFont}>Follow</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default function FollowTabFollowingScreen() {
  const styles = createStyles();
  const followings = store.getState().user.userInfo.followings;
  return (
    <View>
      <FlatList
        data={followings}
        renderItem={(item) => <Follower item={item} />}
        keyExtractor={(item, index) => "following" + index + "-" + item}
      />
    </View>
  );
}
