const postsCollection = require("../db").db().collection("posts")
const ObjectID = require("mongodb").ObjectID
const sanitizeHTML = require("sanitize-html")

let Post = function (data, userid, requestedPostId) {
  this.data = data
  this.errors = []
  this.userid = userid
  this.requestedPostId = requestedPostId
}

Post.prototype.cleanUp = function () {
  if (typeof this.data.title != "string") {
    this.data.title = ""
  }
  if (typeof this.data.body != "string") {
    this.data.body = ""
  }

  // get rid of any bogus properties
  this.data = {
    title: sanitizeHTML(this.data.title.trim(), { allowedTags: [], allowedAttributes: {} }),
    body: sanitizeHTML(this.data.body.trim(), { allowedTags: [], allowedAttributes: {} }),
    username: sanitizeHTML(this.data.username.trim(), { allowedTags: [], allowedAttributes: {} }),
    createdDate: new Date(),
    author: ObjectID(this.userid),
  }
}

Post.prototype.validate = function () {
  if (this.data.title == "") {
    this.errors.push("You must provide a title.")
  }
  if (this.data.body == "") {
    this.errors.push("You must provide post content.")
  }
}

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      // save post into database
      postsCollection
        .insertOne(this.data)
        .then((info) => {
          resolve(info.ops[0]._id)
        })
        .catch((e) => {
          this.errors.push("Please try again later.")
          reject(this.errors)
        })
    } else {
      reject(this.errors)
    }
  })
}

module.exports = Post
