import React, { useState, useEffect } from "react";
import { Button, Text, View, Image, TouchableOpacity } from "react-native";
import GLOBAL from "../GLOBAL.json";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import createStyles from "../styles/styles";
import ProfilePosts from "./ProfilePosts";
import LoadingSpinner from "./LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserId,
  selectUserFollowings,
  followUser,
} from "../features/user/userSlice";

export default function OtherUserProfileScreen({ navigation, route }) {
  const styles = createStyles();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({ status: "idle" });
  const appUserId = useSelector(selectUserId);
  const isFollowed = useSelector(selectUserFollowings).includes(
    userInfo?.userId
  );
  console.log(userInfo);
  useEffect(() => {
    const { userId } = route.params;
    let isMount = true;
    (async () => {
      const fetchUser = await axios.get(
        GLOBAL.SERVERIP + "/api/user/" + userId
      );
      const userPostsArr = [];
      for (let [index, data] of fetchUser.data.posts.reverse().entries()) {
        userPostsArr[Math.floor(index / (3 * 1))] || userPostsArr.push([]);
        userPostsArr[Math.floor(index / (3 * 1))].push({
          authorId: userId,
          postId: data,
        });
      }
      while (userPostsArr[userPostsArr.length - 1].length % 3 !== 0) {
        userPostsArr[userPostsArr.length - 1].push("");
      }

      setTimeout(() => {
        if (isMount) {
          setUserInfo({ status: "succeeded", ...fetchUser.data, userPostsArr });
        }
      }, 1000);
    })();
    return () => {
      console.log("profile unmount");
      isMount = false;
    };
  }, [route]);
  if (userInfo.status === "idle") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LoadingSpinner />
      </View>
    );
  } else {
    return (
      <View style={styles.css.profileBody}>
        <View style={styles.css.userInformation}>
          <View style={styles.css.userInformationHeader}>
            <Image
              style={styles.css.userImage}
              source={{
                uri:
                  GLOBAL.SERVERIP +
                  "/users/" +
                  userInfo.userId +
                  "/userimage.png",
              }}
            />
            <View style={styles.css.userInformationQtys}>
              <View style={styles.css.userInformationQtysComponent}>
                <Text style={[styles.css.boldFont, styles.css.informationQty]}>
                  {userInfo.postQty}
                </Text>
                <Text style={[styles.css.normalFont, { textAlign: "center" }]}>
                  Posts
                </Text>
              </View>
              <View style={styles.css.userInformationQtysComponent}>
                <Text style={[styles.css.boldFont, styles.css.informationQty]}>
                  {userInfo.followerQty}
                </Text>
                <Text style={[styles.css.normalFont, { textAlign: "center" }]}>
                  Followers
                </Text>
              </View>
              <View style={styles.css.userInformationQtysComponent}>
                <Text style={[styles.css.boldFont, styles.css.informationQty]}>
                  {userInfo.followingQty}
                </Text>
                <Text style={[styles.css.normalFont, { textAlign: "center" }]}>
                  Following
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.css.userInformationBio]}>
            <Text
              style={[
                styles.css.boldFont,
                styles.css.userInformationBiosComponent,
              ]}
            >
              {userInfo.userId}
            </Text>
            <Text
              style={[
                styles.css.normalFont,
                styles.css.userInformationBiosComponent,
              ]}
            >
              {userInfo.bio}
            </Text>
          </View>
          {userInfo.userId !== appUserId ? (
            <View style={[styles.css.userActions]}>
              <TouchableOpacity
                style={[
                  isFollowed
                    ? styles.css.userActionComponent
                    : styles.css.userActionComponentActivated,
                ]}
                onPress={() => {
                  dispatch(followUser(userInfo.userId));
                  isFollowed
                    ? setUserInfo({
                        ...userInfo,
                        followerQty: userInfo.followerQty - 1,
                      })
                    : setUserInfo({
                        ...userInfo,
                        followerQty: userInfo.followerQty + 1,
                      });
                }}
              >
                <Text 
                style={[styles.css.superBoldFont,
                  isFollowed|| {color:styles.colors.background},
                ]}>
                  {isFollowed ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
              <View style={[styles.css.userActionComponent]}>
                <Text style={styles.css.superBoldFont}>Message</Text>
              </View>
            </View>
          ) : (
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
          )}
        </View>
        <ProfilePosts userPosts={userInfo.posts} userId={userInfo.userId} />
      </View>
    );
  }
}
