import React, { useState, createContext } from "react";
import Comments from "./Comments";

export const CommentContext = createContext({});

export default function CommentsProvider({ navigation, route }) {
  const { postId } = route.params;
  const [postData, setPostData] = useState({ status: "idle" });
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState({ userId: "", index: -1 });
  const [inputContent, onChangeText] = React.useState("");
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
      <Comments postId={postId}/>
    </CommentContext.Provider>
  );
}
