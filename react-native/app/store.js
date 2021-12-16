import { configureStore } from "@reduxjs/toolkit";
import testReducer from "../features/test/TestSlice";
import userReducer from "../features/user/userSlice";
import feedsReducer from "../features/feeds/feedsSlice";
import messageReducer from "../features/message/messageSlice";
import notificationReducer from "../features/notification/notificationSlice";

export default configureStore({
  reducer: {
    test: testReducer,
    user: userReducer,
    feeds: feedsReducer,
    message: messageReducer,
    notification: notificationReducer
  },
});
