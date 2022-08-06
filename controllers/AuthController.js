import UserModel from "../models/userModel.js";
import { compare, genSalt, hash } from "bcrypt";


export const registerUser = async (req, res, next) => {
    try {
        const { username, password, firstName, lastName } = req.body;

        const salt = await genSalt(10);
        const hashPassword = await hash(password, salt);

        const newUser = new UserModel({
            username,
            password: hashPassword,
            firstName,
            lastName
        });

        await newUser.save();
        return res.status(201).json(newUser);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: `${Object.keys(error.keyValue)} should be unique ` });
        }
        res.status(500).json(error);
    }
}

// user Login
export const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const validate = await compare(password, user.password);
        if (!validate)
            return res.status(400).json({ message: "wrong password" });

        return res.status(200).json(user);
    } catch (error) {
        return res.json(error);
    }
}