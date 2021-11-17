const passport = require('passport')
const bcrypt = require('bcryptjs')
//const fetch = require('node-fetch')
const sharp = require('sharp')
const axios = require('axios')
const { nanoid } = require('nanoid')
const { Binary } = require('mongodb')
const multer = require('multer')
//const async = require('async')

module.exports = function (app, DBUsers, DBPosts, DBPostContents) {
  const postContentUpload = multer({
    limit: {
      fileSize: 2000000,
    },
    fileFilter(req, file, cb) {
      // 只接受三種圖片格式
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error('Please upload an image'))
      }
      cb(null, true)
    },
  })

  app.all('*', function (req, res, next) {
    //console.log(req.headers)
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  app.route('/').get((req, res) => {
    res.sendFile('/src/pages/index.html', { root: __dirname })
  })

  app.route('/users/:id/userimage').get((req, res) => {
    const requestingId = req.params.id
    DBUsers.findOne({ userId: requestingId }, function (err, user) {
      if (err) {
        res.send('error')
      }
      if (user) {
        res.set('Content-Type', 'image/png')
        res.send(Buffer.from(JSON.stringify(user.userImage), 'base64'))
      }
    })
  })

  app.route('/api/user/:id').get(async (req, res) => {
    const requestingId = req.params.id
    try {
      const userData = await findUserById(requestingId, {
        _id: 0,
        userId: 1,
        userType: 1,
        userName: 1,
        bio: 1,
        postQty: 1,
        followerQty: 1,
        followingQty: 1,
        posts: 1,
      })
      res.send(userData)
    } catch (err) {
      res.send(err)
    }
  })

  //REGISTER NEW USERS
  app.route('/register').post((req, res, next) => {
    const qty = req.body.qty > 10 ? 10 : req.body.qty
    const registerQueue = []
    const userImages = []
    axios.get(
      'https://api.unsplash.com/photos/random/?client_id=-wzE0BIzONiuaXjvyLXnad4JXDvshui_8IK_UNnwuxA&query=portrait&count=' +
        String(qty)
    )
      .then(function (response) {
        return response.data
      })
      .then(function (data) {
        let images = []
        let imagesBuffer = []
        let imagesPromise = []
        let renderQty = 0
        for (let [index, imageObj] of data.entries()) {
          images.push(
            imageObj.urls.raw + '&fm=png&fit=crop&w=300&h=300&dpr=2.png'
          )
          imagesPromise.push(
            axios
              .get(images[index], { responseType: 'arraybuffer' })
              .then((res) => {
                return sharp(res.data).png().toBuffer()
              })
              .then((res) => 
                imagesBuffer.push(res)
              )
          )
        }
        Promise.all(imagesPromise).then(() => {
          //console.log(imagesBuffer[1])
          axios.get('http://names.drycodes.com/' + String(qty))
            .then(function (response) {
              return response.data
            })
            .then(function (data) {
              const names = data
              for (let i = 0; i < qty; i++) {
                registerQueue.push({
                  userId: req.body.userid + names[i].toLowerCase(),
                  userType: 'bot',
                  userName: names[i],
                  password: req.body.password,
                  createDate: Date.now(),
                  lastLoginDate: Date.now(),
                  bio: '',
                  userImage: imagesBuffer[i],
                  postQty: 0,
                  posts: [],
                  followerQty: 0,
                  followers: [],
                  followingQty: 0,
                  followings: [],
                })
              }

              const hash = bcrypt.hashSync(req.body.password, 12)
              DBUsers.insertMany(registerQueue, (err, doc) => {
                if (err) {
                  res.send('error')
                } else {
                  res.send('success')
                  next(null, doc.ops[0])
                }
              })
            })
        })
      })
  })

  //ADD NEW POSTS
  app.route('/addnewposts').post(async (req, res, next) => {
    try {
      const qty = req.body.qty > 10 ? 10 : req.body.qty
      const quotes = await fetch(
        'https://goquotes-api.herokuapp.com/api/v1/random?count=' + String(qty)
      )
      const data = await fetch(
        'https://api.unsplash.com/photos/random/?client_id=-wzE0BIzONiuaXjvyLXnad4JXDvshui_8IK_UNnwuxA&count=' +
          String(qty)
      ).then((response) => response.json())
      const images = []
      const title = []
      for (let [index, dataObj] of data.entries()) {
        images.push(dataObj.urls.raw + '&fm=png&fit=crop&w=800&h=800&dpr=2.png')
      }
      const bots = await findUsers({ userType: 'bot' }, { _id: 0, userId: 1 })
      const newPostsQueue = []
      for (let i = 0; i < qty; i++) {
        const contentData = await axios
          .get(images[i], { responseType: 'arraybuffer' })
          .then((res) => {
            return sharp(res.data).png().toBuffer()
          })
        newPostsQueue.push({
          postId: nanoid(),
          postByUserId: bots[Math.floor(Math.random() * bots.length)].userId,
          date: Date.now(),
          topic: quotes[i],
          content: images[i],
          location: '',
          contentData,
        })
      }
      for (let i = 0; i < qty; i++) {
        await findUserAndUpdate(newPostsQueue[i].postByUserId, {
          $push: { posts: newPostsQueue[i].postId },
          $inc: { postQty: 1 },
        })
        const contentDocument = {
          postId: newPostsQueue[i].postId,
          postByUserId: newPostsQueue[i].postByUserId,
          date: newPostsQueue[i].date,
          contentData: newPostsQueue[i].contentData,
        }
        const contentId = await saveContent(contentDocument)
        const postDocument = {
          postId: newPostsQueue[i].postId,
          postByUserId: newPostsQueue[i].postByUserId,
          date: newPostsQueue[i].date,
          location: newPostsQueue[i].location,
          contentId: newPostsQueue[i].contentId,
          contentFirstType: 'image',
          contentQty: 1,
          topic: newPostsQueue[i].topic,
          commentQty: 0,
          comments: [],
          likeQty: 0,
          likesByUserId: [],
        }
        await savePost(postDocument)
      }
      res.send('success')
    } catch (err) {
      res.send(err)
    }
  })

  //NEW POST
  app
    .route('/newpost')
    .post(postContentUpload.single('content'), async (req, res, next) => {
      const postId = nanoid()
      const postByUserId = req.body.userid
      const date = Date.now()
      const location = req.body.location
      const contentData = await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({
          quality: 100,
          chromaSubsampling: '4:4:4',
          force: true, // <----- add this parameter
        })
        .toBuffer()
      const topic = req.body.topic
      try {
        await findUserAndUpdate(postByUserId, {
          $push: { posts: postId },
          $inc: { postQty: 1 },
        })
        const contentDocument = {
          postId,
          postByUserId,
          date,
          contentData,
        }
        const contentId = await saveContent(contentDocument)
        const postDocument = {
          postId,
          postByUserId,
          date,
          location,
          contentId,
          contentFirstType: 'image',
          contentQty: 1,
          topic,
          commentQty: 0,
          comments: [],
          likeQty: 0,
          likesByUserId: [],
        }
        const savedPostId = await savePost(postDocument)
        res.send(savedPostId)
      } catch (error) {
        res.send(error)
      }
    })

  //GET POST

  app.route('/api/post/:id').get(async (req, res) => {
    const requestingId = req.params.id
    try {
      const post = await findPostById(requestingId)
      res.send({
        postId: post.postId,
        postByUserId: post.postByUserId,
        date: post.date,
        location: post.location,
        contentFirstType: post.contentFirstType,
        contentQty: post.contentQty,
        topic: post.topic,
        commentQty: post.postQty,
        likeQty: post.likeQty,
      })
    } catch (err) {
      res.send(err)
    }
  })

  //GET POST CONTENT

  app.route('/post/:id/content').get(async (req, res) => {
    const requestingId = req.params.id
    try {
      const postContentId = (await findPostById(requestingId)).contentId
      DBPostContents.findOne({ _id: postContentId }, function (err, content) {
        if (err) {
          res.send(err)
        }
        if (content) {
          res.set('Content-Type', 'image/jpeg')
          res.send(Buffer.from(JSON.stringify(content.contentData), 'base64'))
        }
      })
    } catch (err) {
      res.send(err)
    }
  })

  //GET FEED

  app.route('/feed').get(async function (req, res) {
    const userId = req.body.userId
    try {
    } catch (err) {
      res.send(err)
    }
  })

  //PROMISE

  //PROMISE --- GET ONE USER by ID
  const findUserById = (userId, projection) =>
    new Promise((resolve, reject) => {
      DBUsers.findOne({ userId }, { projection }, (err, user) => {
        if (err) {
          reject(err)
        }
        if (user) {
          resolve(user)
        } else {
          reject('user not found')
        }
      })
    })

  //PROMISE --- FIND USER by ID and UPDATE
  const findUserAndUpdate = (userId, updateAction) =>
    new Promise((resolve, reject) => {
      DBUsers.findOneAndUpdate({ userId }, updateAction, (err, user) => {
        if (err) {
          reject(err)
        }
        if (!user.value) {
          reject('user no found')
        }
        if (user.value) {
          resolve(user.value)
        }
      })
    })

  //PROMISE --- GET POST by ID
  const findPostById = (requestingId) =>
    new Promise((resolve, reject) => {
      DBPosts.findOne({ postId: requestingId }, function (err, post) {
        if (err) {
          reject(err)
        }
        if (!post) {
          reject('post not found')
        }
        if (post) {
          resolve(post)
        }
      })
    })

  //PROMISE --- GET USER by (QUERY) return (PROJECTION)

  const findUsers = (query, projection) =>
    new Promise((resolve, reject) => {
      const users = DBUsers.find(query, { projection: projection }).toArray()
      if (users.length === 0) {
        reject('users not found')
      } else {
        resolve(users)
      }
    })

  //PROMISE --- SAVE CONTENT return ID
  const saveContent = (contentDocument) =>
    new Promise((resolve, reject) => {
      DBPostContents.insertOne(contentDocument, (err, content) => {
        if (err) {
          reject(err)
        }
        if (content) {
          resolve(content.insertedId)
        }
      })
    })
  const savePost = (postDocument) =>
    new Promise((resolve, reject) => {
      DBPosts.insertOne(postDocument, (err, post) => {
        if (err) {
          reject(err)
        }
        if (post) {
          resolve(postDocument.postId)
        }
      })
    })
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
