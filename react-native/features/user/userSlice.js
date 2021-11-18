import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
  status: "idle",
  userInfo: {},
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await axios.get(
    "http://192.168.3.20:3000/api/user/BOT.exar_kun_captain_rex"
  ).then(response => response.data)
  .catch((error) => {console.error(error)})
  return response;
});

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [fetchUser.pending]: (state, action) => {
      state.status = "pending";
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.userInfo = action.payload;
    },
  },
});

export default userSlice.reducer;

export const selectUserInfoStatus = (state) => state.user.status;

export const selectUserId = (state) => state.user.userInfo.userId;
export const selectUserType = (state) => state.user.userInfo.userType;
export const selectUserName = (state) => state.user.userInfo.userName;
export const selectUserBio = (state) => state.user.userInfo.bio;
export const selectUserPostQty = (state) => state.user.userInfo.postQty;
export const selectUserFollowerQty = (state) => state.user.userInfo.followerQty;
export const selectUserFollowingQty = (state) => state.user.userInfo.followingQty;
export const selectUserPosts = (state) => state.user.userInfo.posts;
//export const selectUserFollowers = (state) => state.user.userInfo.followers;
//export const selectUserFollowings = (state) => state.user.userInfo.followings;
