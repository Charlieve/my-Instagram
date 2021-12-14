import GLOBAL from "../../GLOBAL.json";
import { io } from "socket.io-client";
import store from "../../app/store";
import {
  selectMessage,
  fetchMessage,
  offloadMessage,
  contactOnline,
  contactOffline,
  pushMessage,
  sendMessageSuccess,
  receiveMessage
} from "./messageSlice";
import { useSelector, useDispatch } from "react-redux";

const socket = io(GLOBAL.SERVERIP, { withCredentials: true });
const messageState = store.getState().message;

const online = async (userId) => {
  await store.dispatch(fetchMessage(userId));
  socket.emit("userOnline", userId);
  const contacts = [];
  for (const contact of [...new Set(store.getState().message.contacts)]) {
    contacts.push(contact.userId);
  }
  socket.emit("syncUserContactsActivity", contacts);
};

const offline = () => {
  const userId = store.getState().message.userId;
  store.dispatch(offloadMessage());
  socket.emit("userOffline", userId);
};

const syncUsersActivity = (userContacts) => {
  socket.emit("syncUserContactsActivity", userContacts);
};

const sendMessage = (message) => {
  store.dispatch(pushMessage(message));
  socket.emit("sendMessageFromClient", {
    ...message,
    authedUserId: message.sendMessageData.userId, //will do some authenticity
  });
};

const subscript = () => {
  socket.on("greeting", (data) => {
    console.log(data);
  });

  socket.on("contactOnline", (data) => {
    store.dispatch(contactOnline(data));
  });

  socket.on("contactOffline", (data) => {
    store.dispatch(contactOffline(data));
  });

  socket.on("sendMessageFromClientSuccess", (data) => {
    store.dispatch(sendMessageSuccess(data));
  });

  socket.on("sendMessageFromOtherUser", (message) => {
    store.dispatch(receiveMessage(message));
  });
};

const test = () => {
  // console.log(useSelector(selectMessage));
  console.log("messageHanlder");
};

export default {
  online,
  offline,
  syncUsersActivity,
  test,
  subscript,
  sendMessage,
};
