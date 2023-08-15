const Post = require("../models/Post");
const Like = require("../models/Like");
const CommentModel = require("../models/Comment");
const jwt = require("jsonwebtoken");

//new post handler
const newPost = async (req, res) => {
  try {
    const { Title, Description } = req.body;
    console.log(req.body);
    if (Title == "" || Description == "") {
      throw new Error("Missing fields");
    } else {
      const post = await Post.create({
        user_id: req.userId,
        title: Title,
        description: Description,
      });
      if (post) {
        res.status(200).send({
          Post_id: post._id,
          Title: post.title,
          Description: post.description,
          CreatedAt: post.createdAt,
        });
      } else {
        throw new Error("Internal Server Error");
      }
    }
  } catch (err) {
    res.status(500);
    res.json({ error: err.message });
  }
};

//delete post handler
const deletePost = async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findOne({
      _id: req.params.id,
      user_id: req.userId,
    });
    if (post) {
      console.log(post);
      await Post.deleteOne({
        _id: req.params.id,
        user_id: req.userId,
      });
      res.status(200).json({ success: "Deleted" });
    } else {
      throw new Error("Post not found");
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

//like handler
const likePost = async (req, res) => {
  try {
    console.log(req.params.id);
    const like = await Like.create({
      post_id: req.params.id,
      user_id: req.userId,
    });
    if (like) {
      console.log("LIKE : ", like._id);
      // adding like to the Post
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        $push: { likes: like._id },
      });
      if (updatedPost) {
        console.log(updatedPost);
        res.status(200).json({ success: "Successful" });
      } else {
        throw new Error("Something went wrong");
      }
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

//unlike handler
const unlikePost = async (req, res) => {
  try {
    console.log(req.params.id);
    const unlike = await Like.findOne({
      post_id: req.params.id,
      user_id: req.userId,
    });
    if (unlike) {
      await Like.findByIdAndDelete(unlike._id);
      // removing like from the Post
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: unlike._id },
      });
      if (updatedPost) {
        console.log(updatedPost);
        res.status(200).json({ success: "Successful" });
      } else {
        throw new Error("Something went wrong");
      }
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

//add comment handler
const newComment = async (req, res) => {
  try {
    // console.log("API HIT");
    console.log(req.params.id);
    const { Comment } = req.body;
    if (Comment == "") {
      throw new Error("Missing fields");
    } else {
      const post = Post.findOne({ _id: req.params.id });
      if (post) {
        const comment = await CommentModel.create({
          post_id: req.params.id,
          user_id: req.userId,
          statement: Comment,
        });
        if (comment) {
          // adding comment to the Post
          const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: comment._id },
          });
          if (updatedPost) {
            console.log(updatedPost);
            res.status(200).json({
              Comment_id: comment._id,
            });
          } else {
            throw new Error("Something went wrong");
          }
        } else {
          throw new Error("Something went wrong");
        }
      } else {
        throw new Error("Post not found");
      }
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

// get post handler
const getPost = async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id).populate("comments likes");
    if (post) {
      res.status(200).json({
        ID: post._id,
        OwnerId: post.user_id,
        Title: post.title,
        Description: post.description,
        NumberOfLikes: post.likes.length,
        NumberOfComments: post.comments.length,
        Likes: post.likes,
        Comments: post.comments,
      });
    } else {
      throw new Error("Post not found");
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

//all posts handler
const allPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.userId }).populate("comments");
    if (posts) {
      res.status(200).json(
        posts.map((post) => {
          return {
            id: post._id,
            title: post.title,
            desc: post.description,
            created_at: post.createdAt,
            comments: post.comments,
            likes: post.likes.length,
          };
        })
      );
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

module.exports = {
  newPost,
  deletePost,
  likePost,
  unlikePost,
  newComment,
  getPost,
  allPosts,
};
