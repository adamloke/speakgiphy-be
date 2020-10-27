const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/", require("./router"))

const server = require("http").createServer(app)
const io = require("socket.io")(server, {
  pingTimeout: 30000,
})

//array of all active users
const activeUsers = []

// add username to active user array on login or register
io.on("connection", function (socket) {
  socket.on("connectUser", function (data) {
    let usernameIndex = activeUsers.indexOf(data.username)
    if (usernameIndex === -1) {
      activeUsers.push(data.username)
      socket.emit("activeUsers", activeUsers)
      socket.broadcast.emit("activeUsers", activeUsers)
    }
  })
})

// remove username from map on logout
io.on("connection", function (socket) {
  socket.on("removeUser", function (data) {
    let usernameIndex = activeUsers.indexOf(data.username)
    activeUsers.splice(usernameIndex, 1)
    socket.broadcast.emit("activeUsers", activeUsers)
  })
})

// broadcast new user posts
io.on("connection", function (socket) {
  socket.on("chatFromBrowser", function (data) {
    try {
      let user = jwt.verify(data.token, process.env.JWTSECRET)
      socket.broadcast.emit("chatFromServer", {
        title: data.title,
        body: data.body,
        username: user.username,
      })
    } catch (e) {
      console.log("Not a valid token for chat.")
    }
  })
})

module.exports = server
