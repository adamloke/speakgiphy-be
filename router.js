const apiRouter = require("express").Router()

const userController = require("./controllers/userController")
const postController = require("./controllers/postController")
const cors = require("cors")
const { db } = require("./db")

apiRouter.use(cors())
apiRouter.get("/", (req, res) => res.json("Backend is working"))

apiRouter.post("/checkToken", userController.checkToken)
apiRouter.get("/posts", postController.apiAllPosts)
apiRouter.post("/checkToken", userController.checkToken)
apiRouter.post("/create-post", userController.apiMustBeLoggedIn, postController.apiCreate)
apiRouter.post("/register", userController.apiRegister)
apiRouter.post("/login", userController.apiLogin)
apiRouter.post("/doesUsernameExist", userController.doesUsernameExist)
apiRouter.post("/doesEmailExist", userController.doesEmailExist)

module.exports = apiRouter
