import GLOBAL from "../GLOBAL.json";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { feedLoadedChangeStatus } from "../features/feeds/feedsSlice";
import { followUser } from "../features/user/userSlice";
import DoubleTapComponent from "../functionComponents/DoubleTapComponent";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import DemoJSON from "../demo/feed/feed1.json"; //delete
import createStyles from "../styles/styles";
import TimeAgo from "./TimeAgo";

import { selectUserId, selectUserFollowings } from "../features/user/userSlice";
import { useNavigation } from "@react-navigation/native";

import LikeEffect from "./LikeEffect";

import LoadingSpinner from "./LoadingSpinner";
import LoadingFeed from "./LoadingFeed";
import LoadingText from "./LoadingText";

export function FeedHeader({
  navigation,
  userId,
  postAuthor,
  location,
  postAuthorType,
  currentStack,
}) {
  const styles = createStyles();
  const dispatch = useDispatch();
  const userFollowings = useSelector(selectUserFollowings);
  const isFollowed = userFollowings.includes(postAuthor);
  return (
    <View style={styles.css.feedHeaderContainer}>
      <View style={styles.css.feedHeaderAuthorContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.push(currentStack + "OtherUserProfileScreen", {
              userId: postAuthor,
            })
          }
        >
          <Image
            style={{ height: "100%", aspectRatio: 1, borderRadius: 50 }}
            source={{
              uri: `${GLOBAL.SERVERIP}/users/${postAuthor}/userimage.png`,
            }}
          />
        </TouchableOpacity>
        <View style={styles.css.feedHeaderAuthor}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 6,
              }}
              onPress={() =>
                navigation.push(currentStack + "OtherUserProfileScreen", {
                  userId: postAuthor,
                })
              }
            >
              <Text style={styles.css.boldFont}>
                {postAuthor.replace(/(.{20})(.*)/, "$1...")}
              </Text>
              {postAuthorType === "bot" && (
                <Icon
                  name="logo-android"
                  color={styles.colors.primary}
                  size={14}
                  style={{ marginLeft: 6 }}
                />
              )}
            </TouchableOpacity>
            {postAuthor !== userId && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="ellipse" size={3.7} color={styles.colors.text} />
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => dispatch(followUser(postAuthor))}
                >
                  {isFollowed ? (
                    <Text
                      style={[
                        styles.css.subFont,
                        { fontSize: 15, fontWeight: "600" },
                      ]}
                    >
                      Following
                    </Text>
                  ) : (
                    <Text style={[styles.css.hrefBoldFont, { fontSize: 15 }]}>
                      Follow
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          {location === "" || (
            <Text style={{ fontSize: 12, color: styles.colors.text }}>
              {location}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.css.feedHeaderAction}>
        <Icon
          onPress={() => navigation.navigate("BottomSheet")}
          name="ellipsis-horizontal"
          color={styles.colors.text}
          size={20}
          style={{ padding: 10 }}
        />
      </View>
    </View>
  );
}

export function FeedImage({
  userId,
  postId,
  isLiked,
  setIsLiked,
  likeQty,
  setlikeQty,
  imageData,
}) {
  const styles = createStyles();
  const imageSrc = imageData
    ? "data:image/png;base64," + imageData
    : `${GLOBAL.SERVERIP}/post/${postId}/content.jpeg`;
  const [click, setClick] = useState(0);
  return (
    <View
      style={{
        aspectRatio: 1,
      }}
    >
      <DoubleTapComponent
        doubleTap={() => {
          setClick(click + 1);
          if (!isLiked) {
            (async () => {
              axios({
                method: "post",
                headers: {
                  "content-type": "application/json",
                  Accept: "application/json",
                },
                url: GLOBAL.SERVERIP + "/api/like/" + postId,
                data: { userId },
              });
            })();
            setIsLiked(!isLiked);
            setlikeQty(likeQty + (isLiked ? -1 : 1));
          }
        }}
        style={{ flex: 1 }}
      >
        <Image style={{ flex: 1 }} source={{ uri: imageSrc }} />
        <LikeEffect click={click} />
      </DoubleTapComponent>
    </View>
  );
}

export function FeedContent({
  navigation,
  userId,
  postId,
  postAuthor,
  topic,
  isLiked,
  setIsLiked,
  likeQty,
  setlikeQty,
  highlightComment,
  setHighlightComment,
  postDate,
  commentQty,
  currentStack,
}) {
  const styles = createStyles();
  return (
    <View
      style={styles.css.feedContentContainer}
    >
      <View
        style={{
          flexDirection: "row",
          marginLeft: -8,
        }}
      >
        <LikeComponent
          userId={userId}
          postId={postId}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          likeQty={likeQty}
          setlikeQty={setlikeQty}
        />
        <Icon
          name="chatbubble-outline"
          onPress={() => navigation.navigate("Comments", { postId })}
          color={styles.colors.text}
          size={24}
          style={{ padding: 8 }}
        />
        <Icon
          //onPress={() => navigation.goBack()}
          name="paper-plane-outline"
          color={styles.colors.text}
          size={24}
          style={{ padding: 8 }}
        />
        <View style={{ marginLeft: "auto", marginRight: -10 }}>
          <Icon
            //onPress={() => navigation.goBack()}
            name="bookmark-outline"
            color={styles.colors.text}
            size={24}
            style={{ width: "auto", padding: 8 }}
          />
        </View>
      </View>
      <View style={styles.css.marginBottom}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {likeQty !== 0 && (
            <Text style={styles.css.boldFont}>{likeQty} likes</Text>
          )}
        </View>
        {topic ? (
          <View>
            <View style={styles.css.marginBottom}>
              <Text style={styles.css.normalFont}>
                <Text
                  style={styles.css.boldFont}
                  onPress={() =>
                    navigation.push(currentStack + "OtherUserProfileScreen", {
                      userId: postAuthor,
                    })
                  }
                >
                  {postAuthor}
                </Text>{" "}
                {topic && <ContentProcessor content={topic} />}
              </Text>
            </View>
            <View>
              <View style={styles.css.marginBottom}>
                {commentQty > 0 && (
                  <View>
                    <Text
                      onPress={() =>
                        navigation.navigate("Comments", { postId })
                      }
                      style={styles.css.subFont}
                    >
                      View {commentQty > 1 && "all "}
                      {commentQty} comment{commentQty > 1 && "s"}
                    </Text>
                  </View>
                )}
              </View>
              {highlightComment.map((comment, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ ...styles.css.marginBottom, flex: 1 }}>
                      <Text style={styles.css.normalFont}>
                        <Text style={styles.css.boldFont}>
                          {comment.author}
                        </Text>{" "}
                        {comment.content}
                      </Text>
                    </View>
                    <Icon
                      onPress={() =>
                        setHighlightComment(
                          [...highlightComment].map(
                            (stateComment, stateIndex) => {
                              if (index === stateIndex) {
                                return {
                                  ...stateComment,
                                  isLiked: !stateComment.isLiked,
                                };
                              } else {
                                return stateComment;
                              }
                            }
                          )
                        )
                      }
                      name={comment.isLiked ? "heart" : "heart-outline"}
                      color={
                        comment.isLiked
                          ? styles.colors.like
                          : styles.colors.text
                      }
                      size={12}
                    />
                  </View>
                );
              })}
            </View>
            <View style={{ marginBottom: 16 }}>
              <TimeAgo style={styles.css.postDateFont} timestamp={postDate} />
            </View>
          </View>
        ) : (
          <View>
            <LoadingText style={{ flex: 1 }} />
            <LoadingText style={{ width: "90%" }} />
            <LoadingText style={{ width: "20%", marginTop: 10 }} />
          </View>
        )}
      </View>
    </View>
  );
}

function ContentProcessor({ content }) {
  const styles = createStyles();
  let fullContent = content.match(/[^\s]+|\n/g) || [];
  const regex = new RegExp("^[#@].+");
  fullContent.forEach((string, index) => {
    if (regex.test(string)) {
      fullContent[index] = (
        <Text key={index} style={styles.css.hrefFont}>
          {fullContent[index - 1] !== "\n" && " "}
          {string}
        </Text>
      );
    } else {
      fullContent[index] =
        fullContent[index - 1] !== "\n" && fullContent[index] !== "\n"
          ? " " + string
          : string;
    }
  });

  function ShortContentProcessor(content) {
    const result = [];
    content.every((string, index) => {
      result.push(string);
      return string !== "\n" && index !== 10;
    });
    if (result[0] !== content.join()) {
      result.push("... ");
      result.push(
        <Text
          key="more"
          style={styles.css.subFont}
          onPress={() => setRendContent(content)}
        >
          more
        </Text>
      );
    }
    return result;
  }
  const shortContent = ShortContentProcessor(fullContent);
  const [rendContent, setRendContent] = useState(shortContent);
  return <Text>{rendContent}</Text>;
}

function LikeComponent({
  userId,
  postId,
  isLiked,
  setIsLiked,
  likeQty,
  setlikeQty,
}) {
  const styles = createStyles();
  return (
    <Icon
      onPress={() => {
        (async () => {
          axios({
            method: "post",
            headers: {
              "content-type": "application/json",
              Accept: "application/json",
            },
            url: GLOBAL.SERVERIP + "/api/like/" + postId,
            data: { userId },
          });
        })();
        setIsLiked(!isLiked);
        setlikeQty(likeQty + (isLiked ? -1 : 1));
      }}
      name={isLiked ? "heart" : "heart-outline"}
      color={isLiked ? styles.colors.like : styles.colors.text}
      size={24}
      style={{ padding: 8 }}
    />
  );
}

export default function Feed({ postId }) {
  const navigation = useNavigation();
  const currentStack = navigation
    .getState()
    .routeNames[0].replace("Screen", "");
  const userId = useSelector(selectUserId);
  const styles = createStyles();
  let feed = DemoJSON;
  const [postAuthor, setPostAuthor] = useState();
  const [postAuthorType, setPostAuthorType] = useState();
  const [postDate, setPostDate] = useState();
  const [location, setLocation] = useState();
  const [content, setContent] = useState();
  const [topic, setTopic] = useState("");
  const [isLiked, setIsLiked] = useState();
  const [likeQty, setlikeQty] = useState(0);
  const [commentQty, setCommentQty] = useState(0);
  const [highlightComment, setHighlightComment] = useState([]); //TODO
  const [status, setStatus] = useState("idle");
  const dispatch = useDispatch();
  const afterLoadedAction = () => {
    dispatch(feedLoadedChangeStatus());
    setStatus("finished");
  };
  if (status !== "finished") {
    if (status === "idle") {
      setStatus("loading");
      (async () => {
        feed = (
          await axios.get(GLOBAL.SERVERIP + "/api/post/" + postId, {
            params: { userid: userId },
          })
        ).data;
        const author = (
          await axios.get(GLOBAL.SERVERIP + "/api/user/" + feed.postByUserId)
        ).data;
        setPostAuthor(author.userId);
        setPostAuthorType(author.userType);
        setPostDate(feed.date);
        setLocation(feed.location);
        setTopic(feed.topic);
        setlikeQty(feed.likeQty);
        setIsLiked(feed.isLiked);
        setCommentQty(feed.commentQty);
        //setTimeout(afterLoadedAction, 200000);
        afterLoadedAction();
      })();
    }
    return <LoadingFeed style={styles.css.feedContainer} />;
  } else {
    return (
      <View style={styles.css.feedContainer}>
        <FeedHeader
          userId={userId}
          postAuthor={postAuthor}
          postAuthorType={postAuthorType}
          location={location}
          navigation={navigation}
          currentStack={currentStack}
        />
        <FeedImage
          userId={userId}
          postId={postId}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          likeQty={likeQty}
          setlikeQty={setlikeQty}
        />
        <FeedContent
          navigation={navigation}
          userId={userId}
          postId={postId}
          postAuthor={postAuthor}
          topic={topic}
          feed={feed}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          likeQty={likeQty}
          setlikeQty={setlikeQty}
          highlightComment={highlightComment}
          setHighlightComment={setHighlightComment}
          postDate={postDate}
          commentQty={commentQty}
          currentStack={currentStack}
        />
      </View>
    );
  }
}
