require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const axios = require("axios");
const { nanoid } = require("nanoid");
const multer = require("multer");

const UNSPLASH_ACCESSKEY = process.env.UNSPLASH_ACCESSKEY;

module.exports = function (app, DBUsers, DBPosts, DBPostContents) {
  const postContentUpload = multer({
    limit: {
      fileSize: 2000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error("Please upload an image"));
      }
      cb(null, true);
    },
  });
  const userImageUpload = multer({
    limit: {
      fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error("Please upload an image"));
      }
      cb(null, true);
    },
  });

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.route("/").get((req, res) => {
    res.sendFile("/src/pages/index.html", { root: __dirname });
  });

  app.route("/users/:id/userimage.png").get((req, res) => {
    const requestingId = req.params.id;
    DBUsers.findOne({ userId: requestingId }, function (err, user) {
      if (err) {
        res.send("error");
      }
      if (user) {
        res.set("Content-Type", "image/png");
        res.send(Buffer.from(JSON.stringify(user.userImage), "base64"));
      }
    });
  });

  //REGISTER USER
  app
    .route("/register")
    .post(userImageUpload.single("userImage"), async (req, res) => {
      REGISTER: try {
        if (!req.body.userid || !req.body.password) {
          res.send("INVALID DATA");
          break REGISTER;
        }
        const userId = req.body.userid;
        const password = req.body.password || "password";
        const bio = req.body.bio || "SOMETHING IS GOING WRONG! I CAN FEEL IT!!";
        const userImage = await sharp(req.file.buffer)
          .toFormat("jpeg")
          .jpeg({
            quality: 100,
            chromaSubsampling: "4:4:4",
            force: true, // <----- add this parameter
          })
          .toBuffer();
        await findUserNotExists(userId);
        const userDocument = {
          userId,
          userType: "user",
          userName: "",
          password,
          createDate: Date.now(),
          lastLoginDate: Date.now(),
          bio,
          userImage,
          postQty: 0,
          posts: [],
          followerQty: 0,
          followers: [],
          followingQty: 0,
          followings: [],
        };
        const result = await registerUser(userDocument);
        res.send(`Create USER["${userId}"] succeeded`);
      } catch (error) {
        res.send(error);
      }
    });

  //REGISTER BOTS
  //http://names.drycodes.com/10?nameOptions=starwarsCharacters&case=lower&separator=_
  app.route("/registerbots").post(async (req, res) => {
    try {
      const qty = req.body.qty > 10 ? 10 : req.body.qty;
      const userIdArr = (
        await axios.get(
          "http://names.drycodes.com/" +
            String(qty) +
            "?nameOptions=starwarsCharacters&case=lower&separator=_"
        )
      ).data;
      const unplashImagesData = (
        await axios.get(
          "https://api.unsplash.com/photos/random/?client_id=" +
            UNSPLASH_ACCESSKEY +
            "&query=portrait&count=" +
            String(qty)
        )
      ).data;
      for (let i = 0; i < qty; i++) {
        await findUserNotExists(userIdArr[i]);
        const imageData = (
          await axios.get(
            unplashImagesData[i].urls.raw +
              "&fm=png&fit=crop&w=300&h=300&dpr=2.png",
            { responseType: "arraybuffer" }
          )
        ).data;
        const userImage = await sharp(imageData)
          .toFormat("jpeg")
          .jpeg({
            quality: 100,
            chromaSubsampling: "4:4:4",
            force: true,
          })
          .toBuffer();
        const userDocument = {
          userId: "BOT." + userIdArr[i],
          userType: "bot",
          userName: userIdArr[i],
          password: "password",
          createDate: Date.now(),
          lastLoginDate: Date.now(),
          bio: "NEVER GONNA GIVE YOU UP",
          userImage,
          postQty: 0,
          posts: [],
          followerQty: 0,
          followers: [],
          followingQty: 0,
          followings: [],
        };
        await registerUser(userDocument);
      }
      console.log(userIdArr);
      res.send(`Create BOT[${userIdArr}] succeeded`);
    } catch (error) {
      res.send(error);
    }
  });

  //ADD NEW POSTS BY BOTS
  app.route("/addnewposts").post(async (req, res, next) => {
    try {
      const qty = req.body.qty > 10 ? 10 : req.body.qty;
      const quotes = [];
      for (let i = 0; i < qty; i++) {
        await axios
          .get(
            "http://metaphorpsum.com/paragraphs/" +
              String(Math.round(Math.random() * 3) + 1) +
              "/" +
              String(Math.round(Math.random() * 5) + 1)
          )
          .then((res) => quotes.push(res.data));
      }
      const imagePaths = (
        await axios.get(
          "https://api.unsplash.com/photos/random/?client_id=-wzE0BIzONiuaXjvyLXnad4JXDvshui_8IK_UNnwuxA&count=" +
            String(qty)
        )
      ).data;
      const title = [];
      for (let [index, dataObj] of quotes.entries()) {
        title.push(
          dataObj + "\n\n#unsplash.com" + " #" + imagePaths[index].user.username
        );
      }
      const images = [];
      for (let [index, dataObj] of imagePaths.entries()) {
        images.push(
          dataObj.urls.raw + "&fm=png&fit=crop&w=800&h=800&dpr=1.png"
        );
      }
      const bots = await findUsers({ userType: "bot" }, { _id: 0, userId: 1 });
      const newPostsQueue = [];
      for (let i = 0; i < qty; i++) {
        const contentData = await axios
          .get(images[i], { responseType: "arraybuffer" })
          .then((res) => {
            return sharp(res.data).png().toBuffer();
          });
        newPostsQueue.push({
          postId: nanoid(),
          postByUserId: bots[Math.floor(Math.random() * bots.length)].userId,
          date: Date.now(),
          topic: title[i],
          content: images[i],
          location: "",
          contentData,
        });
      }
      for (let i = 0; i < qty; i++) {
        await findUserAndUpdate(newPostsQueue[i].postByUserId, {
          $push: { posts: newPostsQueue[i].postId },
          $inc: { postQty: 1 },
        });
        const contentDocument = {
          postId: newPostsQueue[i].postId,
          postByUserId: newPostsQueue[i].postByUserId,
          date: newPostsQueue[i].date,
          contentData: newPostsQueue[i].contentData,
        };
        const contentId = await saveContent(contentDocument);
        const postDocument = {
          postId: newPostsQueue[i].postId,
          postByUserId: newPostsQueue[i].postByUserId,
          date: newPostsQueue[i].date,
          location: newPostsQueue[i].location,
          contentId: contentId,
          contentFirstType: "image",
          contentQty: 1,
          topic: newPostsQueue[i].topic,
          commentQty: 0,
          comments: [],
          likeQty: 0,
          likesByUserId: [],
        };
        await savePost(postDocument);
      }
      res.send("success");
    } catch (error) {
      res.send(error);
    }
  });

  //NEW POST
  app
    .route("/newpost")
    .post(postContentUpload.single("content"), async (req, res, next) => {
      const postId = nanoid();
      const postByUserId = req.body.userid;
      const date = Date.now();
      const location = req.body.location;
      const contentData = await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({
          quality: 100,
          chromaSubsampling: "4:4:4",
          force: true, // <----- add this parameter
        })
        .toBuffer();
      const topic = req.body.topic;
      try {
        await findUserAndUpdate(postByUserId, {
          $push: { posts: postId },
          $inc: { postQty: 1 },
        });
        const contentDocument = {
          postId,
          postByUserId,
          date,
          contentData,
        };
        const contentId = await saveContent(contentDocument);
        const postDocument = {
          postId,
          postByUserId,
          date,
          location,
          contentId,
          contentFirstType: "image",
          contentQty: 1,
          topic,
          commentQty: 0,
          comments: [],
          likeQty: 0,
          likesByUserId: [],
        };
        const savedPostId = await savePost(postDocument);
        res.send(savedPostId);
      } catch (error) {
        res.send(error);
      }
    });

  //GET BOTS
  app.route("/api/bots").get(async (req, res) => {
    try {
      const bots = await findUsers({ userType: "bot" }, { _id: 0, userId: 1 });
      res.send(bots);
    } catch (error) {
      res.send(error);
    }
  });

  //GET USER

  app.route("/api/user/:id").get(async (req, res) => {
    const requestingId = req.params.id;
    try {
      const userData = await findUserById(requestingId, {
        projection: {
          _id: 0,
          userId: 1,
          userType: 1,
          userName: 1,
          bio: 1,
          postQty: 1,
          followerQty: 1,
          followingQty: 1,
          posts: 1,
          followers: 1,
          followings: 1,
        },
      });
      res.send(userData);
    } catch (err) {
      res.send(err);
    }
  });

  //SEARCH USERS

  app.route("/api/search/users/:id").get(async (req, res) => {
    const searchingId = req.params.id;
    try {
      const result = await findUsers(
        { userId: { $regex: searchingId, $options: "gi"} },
        { _id: 0, userId: 1 }
      );
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  });

  //GET POST

  app.route("/api/post/:id").get(async (req, res) => {
    try {
      const requestingId = req.params.id;
      const userId = req.query.userid || "";
      const post = await findPostById(requestingId, {
        _id: 0,
        postId: 1,
        postByUserId: 1,
        date: 1,
        location: 1,
        contentFirstType: 1,
        contentQty: 1,
        topic: 1,
        commentQty: 1,
        likeQty: 1,
        likesByUserId: 1,
      });
      const isLiked = post.likesByUserId.includes(userId);
      res.send({ ...post, isLiked });
    } catch (err) {
      res.send(err);
    }
  });

  //GET FEED

  app.route("/api/feed").get(async (req, res) => {
    try {
      const dbPostsQty = await getPostsQty();
      const randomIndex = Math.floor(Math.random() * dbPostsQty);
      const post = await getPostByIndex(randomIndex, {
        _id: 0,
        postId: 1,
        postByUserId: 1,
        date: 1,
        location: 1,
        content: 1,
        topic: 1,
        commentQty: 1,
        likeQty: 1,
      });
      res.send(post.postId);
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  });

  //GET EXPLORE FEED

  app.route("/api/explore").get(async (req, res) => {
    try {
      const dbPostsQty = await getPostsQty();
      let postArr = {};
      for (let i = 0; i < 3; i++) {
        postArr["feedRow0" + (i + 1)] = [];
        for (let j = 0; j < 3; j++) {
          const randomIndex = Math.floor(Math.random() * dbPostsQty);
          const post = await getPostByIndex(randomIndex, {
            _id: 0,
            postId: 1,
            postByUserId: 1,
          });
          post.firstFeedType = i + j === 0 ? "video" : "image";
          postArr["feedRow0" + (i + 1)].push(post);
        }
      }
      res.send(postArr);
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  });

  //GET POST CONTENT

  app.route("/post/:id/content.jpeg").get(async (req, res) => {
    const requestingId = req.params.id;
    try {
      const postContentId = (
        await findPostById(requestingId, { _id: 0, contentId: 1 })
      ).contentId;
      DBPostContents.findOne({ _id: postContentId }, function (err, content) {
        if (err) {
          res.send(err);
        }
        if (content) {
          res.set("Content-Type", "image/jpeg");
          res.send(Buffer.from(JSON.stringify(content.contentData), "base64"));
        }
      });
    } catch (err) {
      res.send(err);
    }
  });

  //GET POST COMMENTS

  app.route("/post/:id/comments").get(async (req, res) => {
    try {
      const userId = req.query.userid || "";
      const requestingId = req.params.id;
      const post = await findPostById(requestingId, {
        _id: 0,
        postByUserId: 1,
        date: 1,
        topic: 1,
        comments: 1,
      });
      res.send(post);
    } catch (err) {
      res.send(err);
    }
  });

  //GET FEED

  app.route("/feed").get(async function (req, res) {
    const userId = req.body.userId;
    try {
    } catch (err) {
      res.send(err);
    }
  });

  //PATH

  //PATCH --- LIKE ACTION

  app.route("/api/like/:postid").post(async function (req, res) {
    try {
      if (!req.body.userId) {
        reject("Invalid User ID");
      }
      const userId = req.body.userId;
      const postId = req.params.postid;
      await findUserExists(userId);
      const likesByUser = (
        await findPostById(postId, { _id: 0, likesByUserId: 1 })
      ).likesByUserId;
      if (!likesByUser.includes(userId)) {
        await findPostByIdAndUpdate(postId, {
          $push: { likesByUserId: userId },
          $inc: { likeQty: 1 },
        });
        res.send("liked");
      } else {
        await findPostByIdAndUpdate(postId, {
          $pull: { likesByUserId: userId },
          $inc: { likeQty: -1 },
        });
        res.send("unliked");
      }
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  });

  //FOLLOW ACTION

  app.route("/api/follow/:userid").post(async function (req, res) {
    try {
      if (
        !req.body.userId ||
        !req.params.userid ||
        req.params.userid === req.body.userId
      ) {
        reject("Invalid User ID");
      }
      const userId = req.body.userId;
      const targetId = req.params.userid;
      const userFollowingArr = (
        await findUserById(userId, { projection: { _id: 0, followings: 1 } })
      ).followings;
      console.log(userFollowingArr);
      if (!userFollowingArr.includes(targetId)) {
        await findUserAndUpdate(targetId, {
          $push: { followers: userId },
          $inc: { followerQty: 1 },
        });
        await findUserAndUpdate(userId, {
          $push: { followings: targetId },
          $inc: { followingQty: 1 },
        });
        res.send({ targetId: targetId, status: "followed" });
      } else {
        await findUserAndUpdate(targetId, {
          $pull: { followers: userId },
          $inc: { followerQty: -1 },
        });
        await findUserAndUpdate(userId, {
          $pull: { followings: targetId },
          $inc: { followingQty: -1 },
        });
        res.send({ targetId: targetId, status: "unfollowed" });
      }
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  });

  //POST COMMENT

  app.route("/api/pushComment/:postid").post(async function (req, res) {
    try {
      if (!req.body.userId) {
        reject("Invalid User ID");
      }
      if (
        typeof req.body.commentData.comment !== "string" ||
        typeof req.body.commentData.replyToIndex !== "number" ||
        req.body.commentData.replyToIndex < -1
      ) {
        reject("Invalid Comment");
      }
      const userId = req.body.userId;
      const postId = req.params.postid;
      await findUserExists(userId);
      const index = (await findPostById(postId, { _id: 0, commentQty: 1 }))
        .commentQty;
      await findPostByIdAndUpdate(postId, {
        $push: {
          comments: {
            index,
            userId,
            comment: String(req.body.commentData.comment),
            date: Date.now(),
            likeQty: 0,
            replyToIndex: req.body.commentData.replyToIndex,
            likesByUserId: [],
          },
        },
        $inc: { commentQty: 1 },
      });
      res.send("succeeded");
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  });

  //PATCH --- LIKE COMMENT ACTION

  app.route("/api/likeComment/:postid").post(async function (req, res) {
    try {
      if (!req.body.userId) {
        reject("Invalid User ID");
      }
      if (
        typeof req.body.commentIndex !== "number" ||
        req.body.commentIndex < -1
      ) {
        reject("Invalid Action");
      }
      const userId = req.body.userId;
      const postId = req.params.postid;
      const commentIndex = req.body.commentIndex;
      await findUserExists(userId);
      const isLikesByUser = !!(
        await DBPosts.aggregate([
          { $match: { postId: postId } },
          { $project: { _id: 0, comments: 1 } },
          { $unwind: "$comments" },
          { $match: { "comments.index": commentIndex } },
          { $unwind: "$comments.likesByUserId" },
        ]).toArray()
      ).length;
      if (isLikesByUser) {
        await findPostAndUpdate(
          { postId, comments: { $elemMatch: { index: commentIndex } } },
          {
            $inc: { "comments.$.likeQty": -1 },
            $pull: { "comments.$.likesByUserId": userId },
          }
        );
      } else {
        await findPostAndUpdate(
          { postId, comments: { $elemMatch: { index: commentIndex } } },
          {
            $inc: { "comments.$.likeQty": 1 },
            $push: { "comments.$.likesByUserId": userId },
          }
        );
      }
      res.send("succeeded");
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  });

  //PROMISE

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

  const findUserExists = (userId) =>
    new Promise((resolve, reject) => {
      DBUsers.findOne({ userId }, { projection: { _id: 1 } }, (err, user) => {
        if (err) {
          reject(err);
        }
        if (user) {
          resolve(userId);
        } else {
          reject(userId + " is not exists");
        }
      });
    });

  const findUserNotExists = (userId) =>
    new Promise((resolve, reject) => {
      DBUsers.findOne({ userId }, { projection: { _id: 1 } }, (err, user) => {
        if (err) {
          reject(err);
        }
        if (user) {
          reject(userId + " is exists");
        } else {
          resolve(userId);
        }
      });
    });

  //PROMISE --- REGISTER

  const registerUser = (userDocument) =>
    new Promise((resolve, reject) => {
      DBUsers.insertOne(userDocument, (err, user) => {
        if (err) {
          reject(err);
        }
        if (user) {
          resolve(userDocument.userId);
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

  //PROMISE --- GET POST by ID
  const findPostById = (requestingId, projection) =>
    new Promise((resolve, reject) => {
      DBPosts.findOne(
        { postId: requestingId },
        { projection: projection },
        function (err, post) {
          if (err) {
            reject("err");
          }
          if (!post) {
            resolve("post not found");
          }
          if (post) {
            resolve(post);
          }
        }
      );
    });

  //PROMISE --- FIND POST by ID and UPDATE
  const findPostByIdAndUpdate = (postId, updateAction) =>
    new Promise((resolve, reject) => {
      DBPosts.findOneAndUpdate({ postId }, updateAction, (err, post) => {
        if (err) {
          reject(err);
        }
        if (!post.value) {
          reject("post no found");
        }
        if (post.value) {
          resolve(post.value);
        }
      });
    });

  //PROMISE --- FIND POST by ID and UPDATE
  const findPostAndUpdate = (query, updateAction) =>
    new Promise((resolve, reject) => {
      DBPosts.findOneAndUpdate(query, updateAction, (err, post) => {
        if (err) {
          reject(err);
        }
        if (!post.value) {
          reject("post no found");
        }
        if (post.value) {
          resolve(post.value);
        }
      });
    });

  //PROMIST --- GET POSTS QTY IN DB
  const getPostsQty = () =>
    new Promise((resolve, reject) => {
      resolve(DBPosts.countDocuments());
    });

  //PROMISE --- GET POST BY INDEX (FOR GETTING RANDOM FEED)
  const getPostByIndex = (index, projection) =>
    new Promise((resolve, reject) => {
      DBPosts.findOne(
        {},
        {
          skip: index,
          projection,
        },
        (err, post) => {
          if (err) {
            reject(err);
          }
          if (post) {
            resolve(post);
          }
        }
      );
    });

  //PROMISE --- GET USER by (QUERY) return (PROJECTION)

  const findUsers = (query, projection) =>
    new Promise((resolve, reject) => {
      const users = DBUsers.find(query, { projection: projection }).toArray();
      if (users.length === 0) {
        reject("users not found");
      } else {
        resolve(users);
      }
    });

  //PROMISE --- SAVE CONTENT return ID
  const saveContent = (contentDocument) =>
    new Promise((resolve, reject) => {
      DBPostContents.insertOne(contentDocument, (err, content) => {
        if (err) {
          reject(err);
        }
        if (content) {
          resolve(content.insertedId);
        }
      });
    });
  const savePost = (postDocument) =>
    new Promise((resolve, reject) => {
      DBPosts.insertOne(postDocument, (err, post) => {
        if (err) {
          reject(err);
        }
        if (post) {
          resolve(postDocument.postId);
        }
      });
    });
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
