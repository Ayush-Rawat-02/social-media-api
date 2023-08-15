const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 3600 });
};

//login handler
const authenticateUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ email: Email });
    console.log(user);
    if (user && (await bcryptjs.compare(Password, user.password))) {
      res.status(200).json({
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

//getuser handler
const getUser = async (req, res) => {
  try {
    console.log("API hit", req.userId);
    const user = await User.findOne({ _id: req.userId });
    if (user) {
      res.status(200).json({
        Name: user.name,
        Followers: user.followers.length,
        Followings: user.following.length,
      });
    } else {
      throw new Error("User Not Found");
    }
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

//follow handler
const followUser = async (req, res) => {
  try {
    console.log(req.params.id);
    // add authenticated user as follower in the user to be followed
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.userId },
    });
    //add the user followed as following in the authenticated user
    await User.findByIdAndUpdate(req.userId, {
      $push: { following: req.params.id },
    });
    res.status(200).json({ success: "Successful" });
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

//unfollow handler
const unfollowUser = async (req, res) => {
  try {
    console.log(req.params.id);
    // remove authenticated user from follower in the followed user
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.userId },
    });
    //remove followed user from following in the authenticated user
    await User.findByIdAndUpdate(req.userId, {
      $pull: { following: req.params.id },
    });
    res.status(200).json({ success: "Successful" });
  } catch (err) {
    res.status(400);
    res.json({ error: err.message });
  }
};

//**************this is a temporary endpoint */
const createUser = async (req, res) => {
  const { Name, Email, Password } = req.body;
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(Password, salt);
  const user = await User.create({
    name: Name,
    email: Email,
    password: hashedPassword,
  });
  if (user) {
    res.status(200).json({
      _id: user.id,
      Name: user.name,
      Password: user.password,
      Email: user.email,
    });
  } else {
    res.status(400).send("SOmething went wrong");
  }
};

module.exports = {
  authenticateUser,
  getUser,
  followUser,
  unfollowUser,
  createUser,
};
