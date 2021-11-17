import React, { useState, useEffect, useMemo } from "react";
import { FlatList, View, Text, Image, Dimensions } from "react-native";
import axios from "axios";
import LoadingSpinner from './LoadingSpinner'
global.Buffer = global.Buffer || require("buffer").Buffer;


function PostGrid({ postsId, navigation }) {
  const [status, setStatus] = useState("idle");
  const [contentData, setContentData] = useState([]);
  useEffect(() => {
      let isMount = true;
      const getData = (postId) => postId?axios.get(`http://192.168.3.20:3000/post/${postId}/content`, {
          responseType: "arraybuffer",
        }):Promise.resolve('empty');
      const toBuffer = (response) => {
        return response!=='empty'?Buffer.from(response.data, "binary").toString("base64"):'empty'
      };
      const getDataArr = postsId.map(getData);
      Promise.all(getDataArr).then((res) => { 
        if(isMount){
          console.log('done')
          setContentData(res.map(toBuffer))}
      });
      return ()=>{isMount=false};
  }, [postsId]);
  if(contentData.join()!==''){
    return (
      <FlatList
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
          if(item!=='empty'){return(
          <Image
            style={{
              width: Dimensions.get("window").width / 3 - 1,
              aspectRatio: 1,
            }}
            source={{ uri: "data:image/png;base64," + item }}
          />
        )}else{return(<View
          style={{
            width: Dimensions.get("window").width / 3 - 1,
            aspectRatio: 1,
          }} />)}}}
      />
    );}
    else{
      return(
          <LoadingSpinner />
      )
    }
}

export default function ProfilePosts({ navigation, postsArr }) {
  return (
    <FlatList
      style={{ flex: 1, width: "100%" }}
      data={postsArr}
      renderItem={({ item }) => (
        <PostGrid postsId={item} navigation={navigation} />
      )}
      initialNumToRender={1}
      keyExtractor={(item, index) => index.toString()}
      //onEndReachedThreshold={1}
      //onEndReached={() => setRendedPost([...rendedPost,postGridArr[0]])}
      //onRefresh={()=>initalizeFeedAction()}
      //refreshing={false}
    />
  );
}
