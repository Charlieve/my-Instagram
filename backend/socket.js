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
      socket
        .to(data + "CONTACTS")
        .emit("contactOffline", `${data} is offline.`);
    });

    socket.on("disconnect", function (data) {
      for (const id of userId) {
        onlineUsers = onlineUsers.filter((item) => item !== id);
        //tell contacts i'm offline
        socket
          .to(id + "CONTACTS")
          .emit("contactOffline", `${id} is offline.`);
      }

      console.log(`${LOGTEXT()} is disconnected.`);
    });

    socket.on("syncUserContactsActivity", (targetUsers) => {
      userContacts = targetUsers;
      for (const userId of userContacts) {
        socket.join(userId + "CONTACTS");
      }
      console.log(`${LOGTEXT()} SYNC: ${userContacts}`);
    });
  });
};
