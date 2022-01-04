const clc = require("cli-color");

module.exports = function (io, DBUsers, DBPosts, DBPostContents) {
  let onlineUsers = [];

  io.on("connection", function (socket) {
    const clientID = socket.id;
    const clientIP = socket.handshake.address;
    let userId = []; //array for future multiply users login
    let userContacts = [];
    const cliColors = {
      userId: clc.yellow,
      client: clc.xterm(57),
      socket: clc.black.bgWhiteBright.bold,
    };
    const LOGTEXT = () =>
      `${cliColors.socket(" SOCKET.IO ")} [${clientIP} - ${clientID}]${
        userId.length > 0 ? " user[" + cliColors.userId(userId) + "]" : ""
      }`;

    console.log(`${LOGTEXT()} connected.`);

    socket.on("userOnline", (data) => {
      userId.push(data);
      onlineUsers.push(data);

      // create USER's PRIVATE ROOM
      socket.join(data + "SELF");

      console.log(`${LOGTEXT()} is online.`);

      //tell contacts i'm online
      socket.to(data + "CONTACTS").emit("contactOnline", data);

      //   socket.emit("greeting", `hello user[${data}]`);
    });

    socket.on("userOffline", (data) => {
      console.log(`${LOGTEXT()} is offline.`);
      userId = userId.filter((item) => item !== data);
      onlineUsers = onlineUsers.filter((item) => item !== data);

      //tell contacts i'm offline
      socket.to(data + "CONTACTS").emit("contactOffline", data);
    });

    socket.on("disconnect", function () {
      for (const id of userId) {
        onlineUsers = onlineUsers.filter((item) => item !== id);
        //tell contacts i'm offline
        console.log(id);
        socket.to(id + "CONTACTS").emit("contactOffline", id);
      }

      console.log(`${LOGTEXT()} is disconnected.`);
    });

    socket.on("syncUserContactsActivity", (targetUsers) => {
      userContacts = targetUsers;
      for (const userId of userContacts) {
        socket.join(userId + "CONTACTS");

        //get contacts if online already
        if (onlineUsers.some((onlineUserId) => onlineUserId === userId)) {
          socket.emit("contactOnline", userId);
        }
      }
      console.log(`${LOGTEXT()} SYNC: ${userContacts}`);
    });

    socket.on("sendMessageFromClient", async (data) => {
      try {
        const trackingMessageId = data.sendMessageData.trackingMessageId;
        const authedUserId = data.authedUserId;
        const messageData = {
          status: "success",
          userId: authedUserId,
          index: data.sendMessageData.index, //unstable, need to gen a unique id ; no get from request, and send back and update
          contentType: data.sendMessageData.contentType,
          content: data.sendMessageData.content,
          date: Date.now(),
          reactions: {},
          readedBy: {},
        };
        await saveMessage(
          authedUserId,
          {
            $push: { "message.$[elem].message": messageData },
          },
          { arrayFilters: [{ "elem.userId": { $eq: data.targetUserId } }] }
        );
        socket.emit("sendMessageFromClientSuccess", {
          targetUserId: data.targetUserId,
          trackingMessageId,
        });
        for (targetUserIdSep of data.targetUserId) {
          const userGroup = [...data.targetUserId, authedUserId]
            .filter((item) => item !== targetUserIdSep)
            .sort();
          // check targetUser's contacts includes user
          const targetUserContacts = await findUserById(targetUserIdSep, {
            projection: { _id: 0, message: { userId: 1 } },
          });
          if (
            !targetUserContacts.message || //create "message" field
            !targetUserContacts.message.filter(
              (item) =>
                JSON.stringify(item.userId.sort()) ===
                JSON.stringify(userGroup.sort())
            ).length //check if contact exists
          ) {
            await findUserAndUpdate(targetUserIdSep, {
              $push: { message: { userId: userGroup.sort(), message: [] } },
            });
          }
          if (onlineUsers.includes(targetUserIdSep)) {
            saveMessage(
              targetUserIdSep,
              {
                $push: {
                  "message.$[elem].message": {
                    ...messageData,
                    status: "delivered",
                  },
                },
              },
              {
                arrayFilters: [{ "elem.userId": { $eq: userGroup.sort() } }],
                upsert: true,
              }
            );
            socket
              .to(targetUserIdSep + "SELF")
              .emit("sendMessageFromOtherUser", {
                targetUserId: userGroup,
                sendMessageData: messageData,
              });
          } else {
            saveMessage(
              targetUserIdSep,
              {
                $push: {
                  "message.$[elem].message": {
                    ...messageData,
                    status: "undelivered",
                  },
                },
              },
              {
                arrayFilters: [{ "elem.userId": { $eq: userGroup.sort() } }],
                upsert: true,
              }
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("sendMessageReactionFromClient", async (data) => {
      try {
        console.log(data);
        const authedUserId = data.authedUserId;
        const authedUserIdWithOutDot = authedUserId.replace(".", "#"); //got bug if mongodb's objects key name with DOT
        await saveMessage(
          authedUserId,
          {
            $set: {
              ["message.$[elem].message.$[message].reactions." +
              authedUserIdWithOutDot]: data.emoji,
            },
          },
          {
            arrayFilters: [
              {
                "elem.userId": { $eq: data.targetUserId },
              },
              {
                "message.index": { $eq: data.messageIndex },
              },
            ],
          }
        );
        for (targetUserIdSep of data.targetUserId) {
          const userGroup = [...data.targetUserId, authedUserId]
            .filter((item) => item !== targetUserIdSep)
            .sort();
          const updatedUser = await saveMessage(
            targetUserIdSep,
            {
              $set: {
                ["message.$[elem].message.$[message].reactions." +
                authedUserIdWithOutDot]: data.emoji,
              },
            },
            {
              arrayFilters: [
                {
                  "elem.userId": { $eq: userGroup },
                },
                {
                  "message.index": { $eq: data.messageIndex },
                },
              ],
            }
          );
          if (onlineUsers.includes(targetUserIdSep)) {
            socket
              .to(targetUserIdSep + "SELF")
              .emit("sendMessageReactionFromOtherUser", {
                targetUserId: userGroup,
                messageIndex: data.messageIndex,
                userId: authedUserId,
                emoji : data.emoji
              });
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  });

  // PROMISE
  const saveMessage = (userId, updateAction, option) =>
    new Promise((resolve, reject) => {
      DBUsers.findOneAndUpdate(
        { userId },
        updateAction,
        option,
        (err, user) => {
          if (err) {
            reject(err);
          }
          if (!user.value) {
            reject("user no found");
          }
          if (user.value) {
            resolve(user.value);
          }
        }
      );
    });

  //PROMISE --- GET ONE USER by ID
  const findUserById = (userId, option) =>
    new Promise((resolve, reject) => {
      DBUsers.findOne({ userId }, option, (err, user) => {
        if (err) {
          reject(err);
        }
        if (user) {
          resolve(user);
        } else {
          reject("user not found");
        }
      });
    });

  //PROMISE --- FIND USER by ID and UPDATE
  const findUserAndUpdate = (userId, updateAction) =>
    new Promise((resolve, reject) => {
      DBUsers.findOneAndUpdate({ userId }, updateAction, (err, user) => {
        if (err) {
          reject(err);
        }
        if (!user.value) {
          reject("user no found");
        }
        if (user.value) {
          resolve(user.value);
        }
      });
    });
};
