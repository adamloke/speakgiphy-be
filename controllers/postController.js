const Post = require("../models/Post")

const postsCollection = require("../db").db().collection("posts")
exports.apiAllPosts = async function (req, res) {
  const response = await postsCollection.find().toArray()
  //only send x recent posts
  const recentPosts = response.slice(Math.max(response.length - 10, 0))
  res.json(recentPosts)
}

exports.apiCreate = function (req, res) {
  let post = new Post(req.body, req.apiUser._id)
  post
    .create()
    .then(function (newId) {
      res.json(newId)
      console.log(newId)
    })
    .catch(function (errors) {
      res.json(errors)
      console.log(errors)
    })
}
