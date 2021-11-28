import GLOBAL from "../GLOBAL.json";
import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import createStyles from "../styles/styles";


import {
  selectUserFollowerQty,
  selectUserFollowers,
} from "../features/user/userSlice";

const Follower = ({ item }) => {
  const styles = createStyles();
  const followerUserId = item.item;
  console.log(item);
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
          uri: GLOBAL.SERVERIP + "/users/" + followerUserId + "/userimage.png",
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
        style={[
          styles.css.userActionComponent,
          {
            flex: 0,
            height: 30,
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
            justifyContent: "center",
            borderColor: styles.colors.border
          },
        ]}
      >
        <Text style={styles.css.superBoldFont}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function FollowTabFollowerScreen() {
  const styles = createStyles();
  const dispatch = useDispatch();
  const userFollowerQty = useSelector(selectUserFollowerQty);
  const followers = useSelector(selectUserFollowers);
  return (
    <View>
      <FlatList
        data={followers}
        renderItem={(item) => <Follower item={item} />}
        keyExtractor={(item, index) => "follower" + index + "-" + item}
      />
    </View>
  );
}
