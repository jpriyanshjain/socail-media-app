import UserModel from "../models/userModel.js";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);
    req.body.password = hashPassword;
    // addition new
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const newUser = new UserModel(req.body);

    const token = jwt.sign(
      {
        username,
        id: newUser._id,
      },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    await newUser.save();
    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: `${Object.keys(error.keyValue)} should be unique ` });
    }
    next(error);
  }
};

// user Login
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const validate = await compare(password, user.password);
    if (!validate) return res.status(400).json({ message: "wrong password" });
    const token = jwt.sign(
      {
        username,
        id: user._id,
      },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};
