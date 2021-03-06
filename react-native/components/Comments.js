import GLOBAL from "../GLOBAL.json";
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import DoubleTapComponent from "../functionComponents/DoubleTapComponent";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import createStyles from "../styles/styles";
import ContentProcessor from "./ContentProcessor";
import TimeAgo from "./TimeAgo";


import { CommentContext } from "./CommentContext";

function AllCommentsComponent({ AllcommentsData, postId }) {
  return (
    <CommentComponent
      AllcommentsData={AllcommentsData}
      postId={postId}
      index={-1}
    />
  );
}

function CommentComponent({ AllcommentsData, index, style, postId }) {
  const { setReplyTo, setComments, onChangeText } = useContext(CommentContext);
  const styles = createStyles();
  const FailedComponent = ({ status }) => {
    if (status === "failed") {
      return (
        <View style={{ position: "absolute", top: 30, left: -10 }}>
          <Icon
            name={"ellipse"}
            color={"white"}
            size={22}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          <Icon name={"alert-circle"} color={styles.colors.warning} size={22} />
        </View>
      );
    } else {
      return <View />;
    }
  };
  return (
    <View style={style}>
      {AllcommentsData.filter((comment) => comment.replyToIndex === index).map(
        (comment, index) => {
          const likeFunction = (index) => {
            const newComments = [...AllcommentsData];
            newComments[index].isLiked = !newComments[index].isLiked;
            newComments[index].likeQty =
              newComments[index].likeQty +
              (newComments[index].isLiked ? 1 : -1);
            setComments(newComments);
            axios({
              method: "post",
              headers: {
                "content-type": "application/json",
                Accept: "application/json",
              },
              url: GLOBAL.SERVERIP + "/api/likeComment/" + postId,
              data: { userId: comment.userId, commentIndex: comment.index },
            });
          };
          return (
            <View key={comment.index}>
              <View
                opacity={
                  comment?.status === "pending" || comment?.status === "failed"
                    ? 0.5
                    : 1
                }
              >
                <View style={styles.css.comment}>
                  <View style={styles.css.commentLeft}>
                    <Image
                      style={styles.css.commentUserImage}
                      source={{
                        uri: `${GLOBAL.SERVERIP}/users/${comment.userId}/userimage.png`,
                      }}
                    />
                  </View>
                  <View style={styles.css.commentRight}>
                    <DoubleTapComponent
                      doubleTap={() =>
                        comment.isLiked || likeFunction(comment.index)
                      }
                      disabled={comment?.status === "pending"}
                    >
                      <Text style={styles.css.normalFont}>
                        <Text style={styles.css.boldFont}>
                          {comment.userId}
                        </Text>{" "}
                        <ContentProcessor content={comment.comment} />
                      </Text>
                    </DoubleTapComponent>
                    <View style={styles.css.commentBottom}>
                      <TimeAgo
                        style={[
                          styles.css.commentBottomComponent,
                          styles.css.subFont,
                          { fontSize: 12 },
                        ]}
                        timestamp={comment.date}
                        short={true}
                      />
                      {comment.likeQty !== 0 && comment.likeQty > 0 && (
                        <Text
                          style={[
                            styles.css.commentBottomComponent,
                            styles.css.subFont,
                            styles.css.subBoldFont,
                            { fontSize: 12 },
                          ]}
                        >
                          {comment.likeQty} like{comment.likeQty === 1 || "s"}
                        </Text>
                      )}
                      <Pressable
                        onPress={() => {
                          setReplyTo({
                            userId: comment.userId,
                            index: comment.index,
                          });
                          onChangeText("@" + comment.userId + " ");
                        }}
                        disabled={
                          comment?.status === "pending" ||
                          comment?.status === "failed"
                        }
                      >
                        <Text
                          style={[
                            styles.css.commentBottomComponent,
                            styles.css.subFont,
                            styles.css.subBoldFont,
                            { fontSize: 12 },
                          ]}
                        >
                          Reply
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.css.commentLike}>
                    <Pressable
                      onPress={() => likeFunction(comment.index)}
                      disabled={
                        comment?.status === "pending" ||
                        comment?.status === "failed"
                      }
                    >
                      <Icon
                        name={comment.isLiked ? "heart" : "heart-outline"}
                        color={
                          comment.isLiked
                            ? styles.colors.like
                            : styles.colors.text
                        }
                        size={14}
                      />
                    </Pressable>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <CommentComponent
                    AllcommentsData={AllcommentsData}
                    postId={postId}
                    index={comment.index}
                    style={{ width: "90%" }}
                  />
                </View>
              </View>
              <FailedComponent status={comment?.status} />
            </View>
          );
        }
      )}
    </View>
  );
}

export default function CommentsStackScreen({ navigation, postId }) {
  const styles = createStyles();
  const {
    postData,
    comments,
  } = useContext(CommentContext);
  const postAuthor = postData?.postByUserId;
  const postDate = postData?.date;
  const topic = postData?.topic;
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.css.commentsBody}>
        <View style={styles.css.topic}>
          <View style={styles.css.commentLeft}>
            <Image
              style={styles.css.commentUserImage}
              source={{
                uri: `${GLOBAL.SERVERIP}/users/${postAuthor}/userimage.png`,
              }}
            />
          </View>
          <View style={styles.css.commentRight}>
            <Text style={[styles.css.normalFont, { marginBottom: 10 }]}>
              <Text style={styles.css.boldFont}>{postAuthor}</Text>{" "}
              <ContentProcessor content={topic} />
            </Text>
            <TimeAgo style={styles.css.postDateFont} timestamp={postDate} />
          </View>
        </View>
        <View
          style={{
            borderBottomColor: styles.colors.border,
            borderBottomWidth: 1,
            marginBottom: 16,
          }}
        />
        <View>
          <AllCommentsComponent AllcommentsData={comments} postId={postId} />
        </View>
      </View>
    </ScrollView>
  );
}
