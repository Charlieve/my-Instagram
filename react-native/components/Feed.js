import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { feedLoadedChangeStatus } from "../features/feeds/feedsSlice";
import DoubleTapComponent from "../functionComponents/DoubleTapComponent";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import DemoJSON from "../demo/feed/feed1.json"; //delete
import createStyles from "../styles/styles";
import LoadingSpinner from "./LoadingSpinner";
import TimeAgo from "./TimeAgo";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

function FeedHeader({ navigation, postAuthor, location, postAuthorType }) {
  const styles = createStyles();
  return (
    <View
      style={{
        height: 60,
        flexDirection: "row",
        alignContent: "space-between",
      }}
    >
      <View
        style={{
          flex: 1,
          height: "100%",
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 16,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.push("OtherUserProfileScreen", { userId: postAuthor })
          }
        >
          <Image
            style={{ height: "100%", aspectRatio: 1, borderRadius: 50 }}
            source={{
              uri: `http://192.168.3.20:3000/users/${postAuthor}/userimage`,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            height: "100%",
            paddingLeft: 12,
            flexDirection: "column",
            alignContent: "space-between",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() =>
              navigation.push("OtherUserProfileScreen", {
                userId: postAuthor,
              })
            }
          >
            <Text style={styles.css.boldFont}>{postAuthor}</Text>
            {postAuthorType === "bot" && (
              <Icon
                name="logo-android"
                color={styles.colors.primary}
                size={14}
                style={{ marginLeft: 6 }}
              />
            )}
          </TouchableOpacity>
          {location === "" || (
            <Text style={{ fontSize: 12, color: styles.colors.text }}>
              {location}
            </Text>
          )}
        </View>
      </View>
      <View
        style={{
          width: 48,
          height: "100%",
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 8,
          justifyContent: "center",
        }}
      >
        <Icon
          onPress={() => navigation.navigate("FeedAction")}
          name="ellipsis-horizontal"
          color={styles.colors.text}
          size={20}
          style={{ padding: 10 }}
        />
      </View>
    </View>
  );
}

function FeedImage({
  userId,
  postId,
  isLiked,
  setIsLiked,
  likeQty,
  setlikeQty,
}) {
  const styles = createStyles();
  return (
    <View
      style={{
        aspectRatio: 1,
      }}
    >
      <DoubleTapComponent
        doubleTap={() => {
          (async () => {
            axios({
              method: "post",
              headers: {
                "content-type": "application/json",
                Accept: "application/json",
              },
              url: "http://192.168.3.20:3000/api/like/" + postId,
              data: { userId },
            });
          })();
          setIsLiked(!isLiked);
          setlikeQty(likeQty + (isLiked ? -1 : 1));
        }}
        style={{ flex: 1 }}
      >
        <Image
          style={{ flex: 1 }}
          source={{ uri: `http://192.168.3.20:3000/post/${postId}/content` }}
        />
      </DoubleTapComponent>
    </View>
  );
}

function FeedContent({
  navigation,
  userId,
  postId,
  postAuthor,
  topic,
  feed,
  isLiked,
  setIsLiked,
  likeQty,
  setlikeQty,
  highlightComment,
  setHighlightComment,
  postDate,
  commentQty,
}) {
  const styles = createStyles();
  return (
    <View
      style={{
        minHeight: 80,
        paddingLeft: 16,
        paddingRight: 16,
      }}
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
          onPress={() => navigation.goBack()}
          name="paper-plane-outline"
          color={styles.colors.text}
          size={24}
          style={{ padding: 8 }}
        />
        <View style={{ marginLeft: "auto", marginRight: -10 }}>
          <Icon
            onPress={() => navigation.goBack()}
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
          {feed.likeQty !== 0 && (
            <Text style={styles.css.boldFont}>{likeQty} likes</Text>
          )}
        </View>
        <View>
          <View style={styles.css.marginBottom}>
            <Text style={styles.css.normalFont}>
              <Text
                style={styles.css.boldFont}
                onPress={() =>
                  navigation.push("OtherUserProfileScreen", {
                    userId: postAuthor,
                  })
                }
              >
                {postAuthor}
              </Text>{" "}
              {ContentProcessor(topic)}
            </Text>
          </View>
          <View>
            <View style={styles.css.marginBottom}>
              {commentQty > 0 && (
                <View>
                  <Text
                    onPress={() => navigation.navigate("Comments", { postId })}
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
                      <Text style={styles.css.boldFont}>{comment.author}</Text>{" "}
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
                      comment.isLiked ? styles.colors.like : styles.colors.text
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
      </View>
    </View>
  );
}

function ContentProcessor(content) {
  const styles = createStyles();
  if (!content) {
    content = "nothing";
  }
  let fullContent = content.match(/[^\s]+|\n/g);
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
  return rendContent;
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
            url: "http://192.168.3.20:3000/api/like/" + postId,
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

export default function Feed({ navigation, postId }) {
  const userId = useSelector(selectUserId);
  const styles = createStyles();
  let feed = DemoJSON;
  const [postAuthor, setPostAuthor] = useState();
  const [postAuthorType, setPostAuthorType] = useState();
  const [postDate, setPostDate] = useState();
  const [location, setLocation] = useState();
  const [content, setContent] = useState();
  const [topic, setTopic] = useState();
  const [isLiked, setIsLiked] = useState();
  const [likeQty, setlikeQty] = useState();
  const [commentQty, setCommentQty] = useState();
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
          await axios.get("http://192.168.3.20:3000/api/post/" + postId, {
            params: { userid: userId },
          })
        ).data;
        const author = (
          await axios.get(
            "http://192.168.3.20:3000/api/user/" + feed.postByUserId
          )
        ).data;
        setPostAuthor(author.userId);
        setPostAuthorType(author.userType);
        setPostDate(feed.date);
        setLocation(feed.location);
        setTopic(feed.topic);
        setlikeQty(feed.likeQty);
        setIsLiked(feed.isLiked);
        setCommentQty(feed.commentQty);
        setTimeout(afterLoadedAction, 1000);
      })();
    }
    return <LoadingSpinner />;
  } else {
    return (
      <View style={styles.css.feed}>
        <FeedHeader
          postAuthor={postAuthor}
          postAuthorType={postAuthorType}
          location={location}
          navigation={navigation}
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
        />
      </View>
    );
  }
}
