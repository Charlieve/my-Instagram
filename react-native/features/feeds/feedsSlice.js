import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  feeds: [],
};

const fetchFeedAction = async () => {
  const response = await axios
    .get("http://192.168.3.20:3000/api/feed")
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
  //console.log("FEED=>" + String(response));
  return String(response);
};

export const fetchFeed = createAsyncThunk("feeds/fetchFeed", fetchFeedAction)

export const initalizeFeed = createAsyncThunk("feeds/initalizeFeed", fetchFeedAction)

const feedsSlice = createSlice({
    name: "feeds",
    initialState: initialState,
    reducers: {
      feedLoadedChangeStatus(state, action) {
        state.status = "succeeded";
      },
    },
    extraReducers: {
      [initalizeFeed.pending]: (state, action) => {
        state.feeds = []
        state.status = "pending";
      },
      [initalizeFeed.fulfilled]: (state, action) => {
        state.feeds = [action.payload];
      },
      [fetchFeed.pending]: (state, action) => {
        state.status = "pending";
      },
      [fetchFeed.fulfilled]: (state, action) => {
        state.feeds = state.feeds.concat(action.payload);
      }
    },
});

export const { feedLoadedChangeStatus } = feedsSlice.actions;

export default feedsSlice.reducer;

export const selectFeedsStatus = (state) => state.feeds.status;
export const selectFeeds = (state) => state.feeds.feeds;
