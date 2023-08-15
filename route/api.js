const express = require("express");

const {
  authenticateUser,
  followUser,
  unfollowUser,
  getUser,
  createUser,
} = require("../controllers/userController.js");

const {
  newPost,
  deletePost,
  likePost,
  unlikePost,
  newComment,
  getPost,
  allPosts,
} = require("../controllers/postController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

//authentication
router.post("/create", createUser);
router.post("/authenticate", authenticateUser);

//user
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/user", authMiddleware, getUser);

//posts
router.post("/posts", authMiddleware, newPost);
router.delete("/posts/:id", authMiddleware, deletePost);
router.post("/like/:id", authMiddleware, likePost);
router.post("/unlike/:id", authMiddleware, unlikePost);
router.post("/comment/:id", authMiddleware, newComment);
router.get("/posts/:id", getPost);
router.get("/all_posts", authMiddleware, allPosts);

module.exports = router;
