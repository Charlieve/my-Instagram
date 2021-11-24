import React, { useState, useEffect, useMemo } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import PostThumbnail from "./PostThumbnail";
import {Buffer} from "buffer";

function PostGrid({ postsIdnAuthor, navigation }) {
  const [status, setStatus] = useState("idle");
  const [componentWidth,setComponentWidth] = useState(Math.min(800,Dimensions.get('window').width))
  const [contentData, setContentData] = useState([]);
  useEffect(() => {
    let isMount = true;
    const cancelGetData = axios.CancelToken.source()
    const getData = (postIdnAuthor) => {
      return postIdnAuthor
        ? axios
            .get(
              `http://192.168.3.20:3000/post/${postIdnAuthor.postId}/content.jpeg`,
              {
                responseType: "arraybuffer",
                cancelToken: cancelGetData.token
              }
            )
            .then((res) => {
              console.log('got data')
              return {
                postId: postIdnAuthor.postId,
                authorId: postIdnAuthor.authorId,
                data: toBuffer(res.data),
              }
            }).catch((err) => {console.log(err)})
        : Promise.resolve("empty");
    };
    const toBuffer = (data) => {
      return data !== "empty"
        ? Buffer.from(data, "binary").toString("base64")
        : "empty";
    };
    const getDataArr = postsIdnAuthor.map(getData);
    Promise.all(getDataArr).then((res) => {
      if (isMount) {
        console.log("done");
        setContentData(res);
      }
    });
    console.log('promising')
    return () => {
      console.log('unmount')
      isMount = false;
      cancelGetData.cancel('cancel');
    };
  }, [postsIdnAuthor]);
  if (contentData.join() !== "") {
    return (
      <FlatList 
      onLayout={(event) => {
        setComponentWidth(event.nativeEvent.layout.width)
      }}
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 1,
        }}
        data={contentData}
        initialNumToRender={99}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (item !== "empty") {
            return (
              <PostThumbnail
                postData={item.data}
                postId={item.postId}
                authorId={item.authorId}
                style = {{
                  width: componentWidth /3 -1 ,
                  aspectRatio: 1,}}
              />
            );
          } else {
            return (
              <View
                style={{
                  width: componentWidth /3 -1 ,
                  aspectRatio: 1,
                }}
              />
            );
          }
        }}
      />
    );
  } else {
    return (
      <View style={{ height: componentWidth /3 -1 }}>
        <LoadingSpinner />
      </View>
    );
  }
}

export default function ProfilePosts({ navigation, postsArr }) {
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={postsArr}
        renderItem={({ item }) => <PostGrid postsIdnAuthor={item} />}
        initialNumToRender={1}
        keyExtractor={(item, index) => index.toString()}
        //onEndReachedThreshold={1}
        //onEndReached={() => setRendedPost([...rendedPost,postGridArr[0]])}
        //onRefresh={()=>initalizeFeedAction()}
        //refreshing={false}
      />
    </View>
  );
}
