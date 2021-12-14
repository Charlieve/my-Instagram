import GLOBAL from "../../GLOBAL.json";
import { io } from "socket.io-client";
import store from "../../app/store";
import { contactOnline } from "./messageSlice";

const socket = io(GLOBAL.SERVERIP, { withCredentials: true });

const online = (userId) => {
  socket.emit("userOnline", userId);
};

const offline = (userId) => {
  socket.emit("userOffline", userId);
};

const syncUsersActivity = (userContacts) => {
  socket.emit("syncUserContactsActivity", userContacts);
};

socket.on("greeting", (data) => {
  console.log(data);
});

socket.on("contactOnline", (data) => {
  store.dispatch(contactOnline(data));
});

socket.on("contactOffline", (data) => {
  console.log(data);
});

export default {
  online,
  offline,
  syncUsersActivity,
};
