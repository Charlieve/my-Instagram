import React, { useState,useEffect } from "react";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  fetchFeed,
  initalizeFeed,
  selectFeedsStatus,
  selectFeeds,
} from "../features/feeds/feedsSlice";

import Feed from "../components/Feed";

export default function ExploreFeedsContainer({ navigation,postId,AuthorId }) {
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
  const [data, setData] = useState([postId]);
  return (
    <FlatList
      style={{ flex: 1, width: "100%" }}
      data={data}
      renderItem={({ item }) => (
        <Feed feedData={item} postId={item} navigation={navigation} />
      )}
      keyExtractor={(item, index) => 'feed' + index}
      initialNumToRender={0}
      onEndReachedThreshold={1}
      onEndReached={() => onEndReachedAction()}
      onRefresh={()=>initalizeFeedAction()}
      refreshing={false}
    />
  );
}

