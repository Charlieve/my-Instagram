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
  receiveMessage,
  updateMessageReaction,
} from "./messageSlice";
import { useSelector, useDispatch } from "react-redux";
import { pushNotification } from "../notification/notificationSlice";

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

const sendUpdatedMessageReaction = ({
  contactIndex,
  messageIndex,
  emoji,
  targetUserId,
}) => {
  const userId = store.getState().message.userId;
  store.dispatch(
    updateMessageReaction({
      contactIndex,
      messageIndex,
      emoji,
      userId: userId.replace(".", "#"), //mongodb objects key limit (NO DOT of key name)
    })
  );
  socket.emit("sendMessageReactionFromClient", {
    contactIndex,
    messageIndex,
    emoji,
    userId,
    targetUserId,
    authedUserId: userId, //will do some authenticity
  });
};

const subscript = () => {
  socket.on("connect", () => {
    // reconnect action below
    if (store.getState().message.status === "succeeded") {
      console.log("reconnect");
      online(store.getState().message.userId);
    }
  });

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
    const image = `${GLOBAL.SERVERIP}/users/${message.sendMessageData.userId}/userimage.png`;
    const userIdStringify = (userId) => {
      userId = Array.isArray(userId) ? userId : [userId];
      return String(userId).length > 20 && userId.length > 1
        ? `${String(userId[0]).replace(/(.{10})(.*)/, "$1...")} and ${
            userId.length > 2
              ? String(userId.length - 1) + " other users"
              : String(userId[1]).replace(/(.{10})(.*)/, "$1...")
          }`
        : String(userId).replace(",", ", ");
    };
    const title = userIdStringify(message.targetUserId);
    const content =
      message.targetUserId.length > 1
        ? `${message.sendMessageData.userId}: ${message.sendMessageData.content}`
        : `${message.sendMessageData.content}`;
    store.dispatch(pushNotification({ image, title, content }));
  });

  socket.on(
    "sendMessageReactionFromOtherUser",
    ({ targetUserId, messageIndex, userId, emoji }) => {
      const a =store.dispatch(
        updateMessageReaction({
          targetUserId,
          messageIndex,
          emoji,
          userId: userId.replace(".", "#"), //mongodb objects key limit (NO DOT of key name)
        })
      );
      console.log(a)
    }
  );
};

const test = () => {
  // console.log(useSelector(selectMessage));
  console.log("messageHanlder");
};

export default {
  subscript,
  online,
  offline,
  syncUsersActivity,
  test,
  sendMessage,
  sendUpdatedMessageReaction,
};
