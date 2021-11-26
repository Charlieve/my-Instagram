import GLOBAL from "../GLOBAL.json";
import React, { useState, createContext,useEffect } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import Comments from "./Comments";
import CommentInput from "./CommentInput";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import {CommentContext} from './CommentContext'


export default function CommentsProvider({ navigation, route }) {
  const userId = useSelector(selectUserId);
  const { postId } = route.params;
  const [postData, setPostData] = useState({ status: "idle" });
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState({ userId: "", index: -1 });
  const [inputContent, onChangeText] = useState("");
  useEffect(() => {
    let isMount = true;
    (async () => {
      const data = (
        await axios.get(GLOBAL.SERVERIP + "/post/" + postId + "/comments", {
          params: { userid: userId },
        })
      ).data;
      const comments = data.comments;
      comments.map((comment, index) => {
        comments[index] = {
          ...comments[index],
          isLiked: comment.likesByUserId.includes(userId),
        };
      });
      setTimeout(() => {
        if (isMount) {
          setPostData({ status: "succeeded", ...data });
          setComments(comments);
        }
      }, 1000);
    })();
    return () => {
      isMount = false;
    };
  }, [route]);
  if (postData.status === "idle") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LoadingSpinner />
      </View>
    );
  } else {
    return (
      <CommentContext.Provider
        value={{
          postData,
          setPostData,
          replyTo,
          setReplyTo,
          comments,
          setComments,
          inputContent,
          onChangeText,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={64}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: "space-around" }}>
            <Comments postId={postId} />
            <CommentInput postId={postId} />
          </View>
        </KeyboardAvoidingView>
      </CommentContext.Provider>
    );
  }
}
