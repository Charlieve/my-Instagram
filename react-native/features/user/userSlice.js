import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GLOBAL from "../../GLOBAL.json";
import axios from "axios";

const initialState = {
  status: "idle",
  userInfo: {},
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (userId) => {
  const response = await axios
    .get(GLOBAL.SERVERIP + "/api/user/" + userId)
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
  return response;
});

export const followUser = createAsyncThunk(
  "user/followUser",
  async (targetId, state) => {
    const response = await axios({
      method: "post",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      url: GLOBAL.SERVERIP + "/api/follow/" + targetId,
      data: { userId: state.getState().user.userInfo.userId },
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
    return response;
  }
);

export const createMessage = createAsyncThunk(
  "user/createMessage",
  async (targetId, state) => {
    const response = await axios({
      method: "post",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      url: GLOBAL.SERVERIP + "/api/message",
      data: {
        targetId,
        userId: state.getState().user.userInfo.userId,
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
    return response;
  }
);

export const deleteMessage = createAsyncThunk(
  "user/deleteMessage",
  async (targetId, state) => {
    const response = await axios({
      method: "post",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      url: GLOBAL.SERVERIP + "/api/deletemessage",
      data: {
        targetId,
        userId: state.getState().user.userInfo.userId,
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
    return response;
  }
);

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
      state.userInfo.message = state.userInfo.message || [];
    },
    [followUser.fulfilled]: (state, action) => {
      if (action.payload.status === "followed") {
        state.userInfo.followings.push(action.payload.targetId);
        state.userInfo.followingQty++;
      }
      if (action.payload.status === "unfollowed") {
        state.userInfo.followings = state.userInfo.followings.filter(
          (item) => item !== action.payload.targetId
        );
        state.userInfo.followingQty--;
      }
    },
    [createMessage.fulfilled]: (state, action) => {
      state.userInfo.message.push({
        userId: action.payload.userId,
        message: [],
      });
    },
    [deleteMessage.fulfilled]: (state, action) => {
      //delete it before request
      state.userInfo.message = state.userInfo.message.filter(
        (item) =>
          JSON.stringify(item.userId.sort()) !==
          JSON.stringify(action.payload.userId.sort())
      );
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
export const selectUserFollowingQty = (state) =>
  state.user.userInfo.followingQty;
export const selectUserPosts = (state) => state.user.userInfo.posts;
export const selectUserFollowers = (state) => state.user.userInfo.followers;
export const selectUserFollowings = (state) => state.user.userInfo.followings;
export const selectUserMessage = (state) => state.user.userInfo.message;
