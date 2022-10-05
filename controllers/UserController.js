import { genSalt, hash } from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const { password, ...otherDetails } = user._doc;
    return res.status(200).json(otherDetails);
  } catch (error) {
    next(error);
  }
};

export const getFollowedUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const followedUsers = await UserModel.findById(userId, {
      following: 1,
    }).populate("following", {
      following: 0,
      followers: 0,
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    console.log("user", followedUsers);
    return res.status(200).json(followedUsers);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      _id: currentUserId,
      isAdmin: currentUserAdminStatus,
      password,
    } = req.body;
    if (id === currentUserId || currentUserAdminStatus) {
      if (password) {
        const salt = await genSalt(10);
        req.body.password = await hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_TOKEN,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ user, token });
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentUserId, currentUserAdminStatus } = req.body;
    if (id === currentUserId || currentUserAdminStatus) {
      await UserModel.findByIdAndDelete(id);
      return res.status(200).json("user successfully deleted");
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: currentUserId } = req.body;
    if (id === currentUserId) {
      res.status(403);
      throw new Error("action forbidden");
    }
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(currentUserId);

    if (!followUser.followers.includes(currentUserId)) {
      await followUser.updateOne({ $push: { followers: currentUserId } });
      await followingUser.updateOne({ $push: { following: id } });
    }
    return res.status(201).json({ message: "successfully followed user " });
  } catch (error) {
    next(error);
  }
};

export const UnFollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: currentUserId } = req.body;
    if (id === currentUserId) {
      res.status(403);
      throw new Error("action forbidden");
    }
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(currentUserId);

    if (!followUser.followers.includes(currentUserId)) {
      res.status(403);
      throw new Error("user is not followed by you");
    }
    await followUser.updateOne({ $pull: { followers: currentUserId } });
    await followingUser.updateOne({ $pull: { following: id } });
    return res.status(201).json({ message: "successfully unfollowed user " });
  } catch (error) {
    next(error);
  }
};
