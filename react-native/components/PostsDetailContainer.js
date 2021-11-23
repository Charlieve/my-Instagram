import React, { useState,useEffect } from "react";
import { VirtualizedList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeed,
  initalizeFeed,
  selectFeedsStatus,
  selectFeeds,
} from "../features/feeds/feedsSlice";

import Feed from "../components/Feed";


export default function PostsDetailContainer({ navigation }) {
  const dispatch = useDispatch();
  const status = useSelector(selectFeedsStatus);
  const onEndReachedAction = () => {
    if (status !== "pending") {
      (async () => {
        try {
          await dispatch(fetchFeed());
        } catch (err) {
          console.error("Failed to fetch feed:", err);
        }
      })();
    }
  };
  const initalizeFeedAction = async() =>{
    try{
      await dispatch(initalizeFeed());
    } catch (err) {
      console.error("Failed to initalize feed:", err);
    }
  }
  useEffect(()=>{
    status=== 'idle' && initalizeFeedAction()
  })
  return (
    <VirtualizedList
      style={{ flex: 1, width: "100%" }}
      data={useSelector(selectFeeds)}
      renderItem={({ item }) => (
        <Feed feedData={item} postId={item} navigation={navigation} />
      )}
      keyExtractor={(item, index) => 'feed' + index}
      initialNumToRender={1}
      // onEndReachedThreshold={1}
      // onEndReached={() => onEndReachedAction()}
      // onRefresh={()=>initalizeFeedAction()}
      // refreshing={false}
    />
  );
}
