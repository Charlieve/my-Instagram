import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import DemoJSON from "../demo/feed/feed1.json"; //delete
import createStyles from "../styles/styles";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import { useNavigation } from "@react-navigation/native";
import { FeedHeader, FeedImage, FeedContent } from "./Feed";

export default function PostsDetailInitialPost({ postId, postData, authorId }) {
  const navigation = useNavigation();
  const currentStack = navigation.getState().routeNames[0].replace("Screen", "");
  const userId = useSelector(selectUserId);
  const styles = createStyles();
  const postAuthor = authorId;
  const [postAuthorType, setPostAuthorType] = useState();
  const [postDate, setPostDate] = useState();
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("");
  const [isLiked, setIsLiked] = useState();
  const [likeQty, setlikeQty] = useState(0);
  const [commentQty, setCommentQty] = useState(0);
  const [highlightComment, setHighlightComment] = useState([]); //TODO
  useEffect(() => {
    let isMount = true;
    (async () => {
      const feed = (
        await axios.get("http://192.168.3.20:3000/api/post/" + postId, {
          params: { userid: userId },
        })
      ).data;
      const author = (
        await axios.get(
          "http://192.168.3.20:3000/api/user/" + feed.postByUserId
        )
      ).data;
      await new Promise((r) => setTimeout(r, 200)); //delay after transition finished
      setPostAuthorType(author.userType);
      setPostDate(feed.date);
      setLocation(feed.location);
      setTopic(feed.topic);
      setlikeQty(feed.likeQty);
      setIsLiked(feed.isLiked);
      setCommentQty(feed.commentQty);
    })();
    return () => {
      isMount = false;
    };
  }, []);
  return (
    <View style={styles.css.feedContainer}>
      <FeedHeader
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
        imageData={postData}
      />
      <FeedContent
        navigation={navigation}
        userId={userId}
        postId={postId}
        postAuthor={postAuthor}
        topic={topic}
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
