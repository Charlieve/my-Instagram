import { configureStore } from "@reduxjs/toolkit";
import testReducer from "../features/test/TestSlice";
import userReducer from "../features/user/userSlice"
import feedsReducer from "../features/feeds/feedsSlice"

export default configureStore({
  reducer: {
    test: testReducer,
    user: userReducer,
    feeds: feedsReducer
  },
});
