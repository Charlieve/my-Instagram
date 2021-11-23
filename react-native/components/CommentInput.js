import React, { useContext } from "react";
import { View, Text, Image, TextInput, Pressable } from "react-native";
import createStyles from "../styles/styles";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

import { CommentContext } from "./CommentsProvider";

export default function CommentInput({ postId }) {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const {
    inputContent,
    onChangeText,
    replyTo,
    setReplyTo,
    comments,
    setComments,
  } = useContext(CommentContext);
  const postComment = (content) => {
    if (inputContent !== "") {
      const commentIndex = comments.length;
      const postCommentData = {
        status: "pending",
        index: commentIndex,
        userId: userId,
        comment: content,
        date: Date.now(),
        isLiked: false,
        likeQty: 0,
        replyToIndex: replyTo.index,
      };
      setComments([...comments, postCommentData]);
      setReplyTo({ usrId: "", index: -1 });
      onChangeText("");
      (async () => {
        try{
          await axios({
            method: "post",
            headers: {
              "content-type": "application/json",
              Accept: "application/json",
            },
            url: "http://192.168.3.20:3000/api/pushComment/" + postId,
            data: { userId, commentData: postCommentData },
          }).then((res) => (postCommentData.status = res.data));
          setComments([...comments.slice(0, commentIndex), postCommentData],...comments.slice(commentIndex+1));
        } catch (err){
          postCommentData.status = 'failed'
          setComments([...comments.slice(0, commentIndex), postCommentData],...comments.slice(commentIndex+1));
        }
      })();
    }
  };
  return (
    <View>
      <View
        style={{
          width: "100%",
          height: replyTo.index === -1 ? 0 : "auto",
          backgroundColor: styles.colors.border,
          flexDirection: "row",
          paddingRight: 15,
          paddingLeft: 15,
          paddingBottom: replyTo.index === -1 ? 0 : 12,
          paddingTop: replyTo.index === -1 ? 0 : 15,
        }}
      >
        <Text style={{ flex: 1, color: styles.colors.subText }}>
          Replying To {replyTo.userId}
        </Text>
        <Icon
          onPress={() => setReplyTo({ userId: "", index: -1 })}
          name="close"
          color={styles.colors.text}
          size={18}
        />
      </View>
      <View style={styles.css.commentInputContainer}>
        <View style={styles.css.commentInputEmojisContainer}>
          <Pressable onPress={() => onChangeText(inputContent + "❤️")}>
            <Text style={styles.css.commentInputEmoji}>❤️</Text>
          </Pressable>
          <Pressable onPress={() => onChangeText(inputContent + "🙌")}>
            <Text style={styles.css.commentInputEmoji}>🙌</Text>
          </Pressable>
          <Pressable onPress={() => onChangeText(inputContent + "🔥")}>
            <Text style={styles.css.commentInputEmoji}>🔥</Text>
          </Pressable>
          <Pressable onPress={() => onChangeText(inputContent + "👏")}>
            <Text style={styles.css.commentInputEmoji}>👏</Text>
          </Pressable>
          <Pressable onPress={() => onChangeText(inputContent + "😢")}>
            <Text style={styles.css.commentInputEmoji}>😢</Text>
          </Pressable>
          <Pressable onPress={() => onChangeText(inputContent + "😍")}>
            <Text style={styles.css.commentInputEmoji}>😍</Text>
          </Pressable>
          <Pressable onPress={() => onChangeText(inputContent + "😮")}>
            <Text style={styles.css.commentInputEmoji}>😮</Text>
          </Pressable>
          <Pressable onPress={() => onChangeText(inputContent + "😂")}>
            <Text style={styles.css.commentInputEmoji}>😂</Text>
          </Pressable>
        </View>
        <View style={styles.css.commentInput}>
          <Image
            style={styles.css.commentInputUserImage}
            source={{
              uri: `http://192.168.3.20:3000/users/${userId}/userimage.png`,
            }}
          />
          <View style={styles.css.commentInputTextInput}>
            <TextInput
              multiline
              numberOfLines={1}
              placeholder="Add a comment..."
              placeholderTextColor={styles.colors.subText}
              style={styles.css.commentInputTextInputText}
              value={inputContent}
              onChangeText={(text) => onChangeText(text)}
            />
            <Pressable
              style={styles.css.commentInputTextInputSubmit}
              onPress={() => postComment(inputContent)}
            >
              <Text
                style={
                  inputContent !== ""
                    ? styles.css.hrefBoldFont
                    : [styles.css.hrefBoldFont, { color: "#a0c5f6" }]
                }
              >
                Post
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
