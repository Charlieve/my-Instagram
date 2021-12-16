import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { Vibration } from "react-native";

const initialState = {
  show: false,
  data: {},
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    pushNotification(state, action) {
      const image = action.payload.image;
      const contentTitle = action.payload.title;
      const content = action.payload.content;
      state.show = true;
      state.data = { image, contentTitle, content };
      Vibration.vibrate()
    },
    pullNotification(state, action) {
      state.show = false;
    },
  },
  extraReducers: {},
});

export const { pushNotification, pullNotification } = notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotificationIsShow = (state) => state.notification.show;
export const selectNotificationData = (state) => state.notification.data;
