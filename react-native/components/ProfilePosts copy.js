import React, { useState, useEffect } from "react";
import { FlatList, View, Text, Image } from "react-native";
import axios from "axios";
global.Buffer = global.Buffer || require('buffer').Buffer

function PostGrid({
  postsId,
  navigation,
}) {
  console.log(postsId)
  const [contentData, setContentData] = useState([]);
  const [status, setStatus] = useState("idle");
  const getData = (postId) =>
    axios
      .get(`http://192.168.3.20:3000/post/${postId}/content`, {
        responseType: "arraybuffer",
      })
      .then((response) =>
        Buffer.from(response.data, "binary").toString("base64")
      );
  const getDataArr = [];
  if (status === "idle") {
    setStatus("pending");
    for (let i = 0; i < postsId.length; i++) {
      getDataArr.push(getData(postsId[i]));
    }
    console.log();
    Promise.all(getDataArr)
      .then((res) => {
        setContentData(res);
      })
      .then(() => {
        setStatus("succeeded");
      });
  }
  return (
    <FlatList
      style={{ width: "100%" }}
      data={contentData}
      numColumns= {3}
      renderItem={({ item }) => (
        <Image
          style={{ 
            width: "33%" ,
          aspectRatio: 1 }}
          source={{ uri: "data:image/png;base64," + item }}
          keyExtractor={(item, index) => "post" + index}
        />
      )}
    />
  );
}

export default function ProfilePosts({ navigation, posts }) {
  const [containerStatus, setContainerStatus] = useState("idle");
  const postGrid = 1;
  const postGridArr = [];
  if (containerStatus === "idle") {
    for (let [index, data] of posts.entries()) {
      postGridArr[Math.floor(index / (3 * postGrid))] || postGridArr.push([]);
      postGridArr[Math.floor(index / (3 * postGrid))].push(data);
    }
    setContainerStatus('pending')
  }
  const [rendedPost, setRendedPost] = useState([postGridArr[0]]);
  console.log(postGridArr)
  useEffect(() =>
    console.log('use Effect')
  )
  return (
    <FlatList
      style={{ flex: 1, width: "100%" }}
      data={rendedPost}
      renderItem={({ item }) => (
        <PostGrid
          postsId={item}
          navigation={navigation}
        />
      )}
      keyExtractor={(item, index) => "postGrid" + index}
      initialNumToRender={1}
      onEndReachedThreshold={1}
      //onEndReached={() => setRendedPost([...rendedPost,postGridArr[0]])}
      //onRefresh={()=>initalizeFeedAction()}
      //refreshing={false}
    />
  );
}
