import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import GLOBAL from "../../GLOBAL.json";
import axios from "axios";

// import message from "./messageHandler";

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
        // response.contacts.push({ userId, online: false });
        response.contacts.push(userId);
      }
    }

    return response;
  }
);

export const createMessage = createAsyncThunk(
  "user/createMessage",
  async (targetIdArr, state) => {
    const response = await axios({
      method: "post",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      url: GLOBAL.SERVERIP + "/api/message",
      data: {
        targetIdArr,
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
      // message.offline(state.userId);
      state.status = initialState.status;
      state.userId = initialState.userId;
      state.contacts = initialState.contacts;
      state.data = initialState.data;
    },
    contactOnline(state, action) {
      const updatedContacts = state.contacts.map((item) => {
        return {
          userId: item.userId,
          online: item.userId === action.payload ? true : item.online,
        };
      });
      state.contacts = updatedContacts;
    },
    contactOffline(state, action) {
      const updatedContacts = state.contacts.map((item) => {
        return {
          userId: item.userId,
          online: item.userId === action.payload ? false : item.online,
        };
      });
      state.contacts = updatedContacts;
    },
    pushMessage(state, action) {
      const updatedState = state.data.slice();
      updatedState[action.payload.contactIndex].message.push(
        action.payload.sendMessageData
      );
      state.data = updatedState;
    },
    sendMessageSuccess(state, action) {
      const updatedState = state.data.slice();
      const trackingMessageId = action.payload.trackingMessageId;
      let targetUserId = action.payload.targetUserId;
      targetUserId = Array.isArray(targetUserId)
        ? targetUserId
        : [targetUserId];
      const index = state.data
        .map((item) => item.userId.sort())
        .findIndex(
          (item) => JSON.stringify(item) === JSON.stringify(targetUserId.sort())
        );
      updatedState[index].message = updatedState[index].message.map((item) =>
        item.trackingMessageId === trackingMessageId
          ? { ...item, status: "success" }
          : item
      );
      state.data = updatedState;
    },
    receiveMessage(state, action) {
      const updatedState = state.data.slice();
      const targetUserId = action.payload.targetUserId;
      const index = updatedState
        .map((item) => item.userId.sort())
        .findIndex(
          (item) => JSON.stringify(item) === JSON.stringify(targetUserId.sort())
        );
      if (index !== -1) {
        updatedState[index].message.push(action.payload.sendMessageData);
        state.data = updatedState;
      } else {
        // if received message is not in users contact list
        // add to user contact list and push to new message data
        // axios({
        //   method: "post",
        //   headers: {
        //     "content-type": "application/json",
        //     Accept: "application/json",
        //   },
        //   url: GLOBAL.SERVERIP + "/api/message",
        //   data: {
        //     targetId:targetUserId[0], //need to rewrite for group chat
        //     userId: state.userId,
        //   },
        // });
        const updatedContacts = state.contacts.slice().sort;
        for (const userId of targetUserId) {
          const userIdArr = Array.isArray(userId) ? userId : [userId];
          updatedContacts.push({ userId: userIdArr.sort(), online: true });
        }
        updatedState.push({
          userId: targetUserId,
          message: [action.payload.sendMessageData],
        });
        state.contacts = updatedContacts;
        state.data = updatedState;
      }
    },
  },
  extraReducers: {
    [fetchMessage.pending]: (state, action) => {
      state.status = "pending";
    },
    [fetchMessage.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.userId = action.payload.userId;
      state.data = action.payload.message || [];
      const contactsObjectsArr = [];
      for (const contactUserId of Array.from(
        new Set(action.payload.contacts)
      )) {
        contactsObjectsArr.push({ userId: contactUserId, online: false });
      }
      state.contacts = contactsObjectsArr;
    },
    [createMessage.fulfilled]: (state, action) => {
      state.contacts.push({ userId: action.payload.userId, online: false });
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

export const {
  offloadMessage,
  contactOnline,
  contactOffline,
  pushMessage,
  sendMessageSuccess,
  receiveMessage,
} = messageSlice.actions;

export default messageSlice.reducer;

export const selectMessage = (state) => state.message.data;
export const selectMessageContacts = (state) => state.message.contacts;

export const selectMessageByIndex = (state, index) => {
  return state.message.data[index].message;
};
export const selectMessageIndexByUserId = (state, userId) => {
  userId = Array.isArray(userId) ? [...userId].sort() : [userId];
  const index = state.message.data
    .map((item) => item.userId)
    .findIndex(
      (item) => JSON.stringify([...item].sort()) === JSON.stringify(userId)
    );
  return index;
};
