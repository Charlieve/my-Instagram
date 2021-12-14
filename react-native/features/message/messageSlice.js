import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GLOBAL from "../../GLOBAL.json";
import axios from "axios";

import message from "./messageHandler";

const initialState = {
  status: "idle",
  userId: "",
  contacts: [],
  data: [],
};

export const fetchMessage = createAsyncThunk(
  "message/fetchMessage",
  async (userId) => {
    const response = await axios
      .get(GLOBAL.SERVERIP + "/api/user/" + userId + "/message")
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
    response.userId = userId;

    response.contacts = [];
    for (const message of response.message) {
      for (const userId of message.userId) {
        response.contacts.push({ userId, online: false });
      }
    }

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

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    offloadMessage(state, action) {
      message.offline(state.userId);
      state.status = initialState.status;
      state.userId = initialState.userId;
      state.contacts = initialState.contacts;
      state.data = initialState.data;
    },
    contactOnline(state, action) {
      console.log(state)
      const updatedContacts = state.contacts.filter((item) => {
        // console.log(item)
        return {
          userId: item.userId,
          online: item.userId === action.payload ? false : item.online,
        };
      });
      state.contacts = updatedContacts;
    },
  },
  extraReducers: {
    [fetchMessage.pending]: (state, action) => {
      state.status = "pending";
    },
    [fetchMessage.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.userId = action.payload.userId;
      state.contacts = [...new Set(action.payload.contacts)];
      state.data = action.payload.message || [];

      message.online(action.payload.userId);
      const contacts = [];
      for (const contact of [...new Set(action.payload.contacts)]) {
        contacts.push(contact.userId);
      }
      message.syncUsersActivity(contacts);
    },
    [createMessage.fulfilled]: (state, action) => {
      state.data.push({
        userId: action.payload.userId,
        message: [],
      });
    },
    [deleteMessage.fulfilled]: (state, action) => {
      //delete it before request
      state.data = state.data.filter(
        (item) =>
          JSON.stringify(item.userId.sort()) !==
          JSON.stringify(action.payload.userId.sort())
      );
    },
  },
});

export const { offloadMessage, contactOnline } = messageSlice.actions;

export default messageSlice.reducer;

export const selectMessage = (state) => state.message.data;
