import { genSalt, hash } from "bcrypt";
import UserModel from "../models/userModel.js";


export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        console.log("user", user, id);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const { password, ...otherDetails } = user._doc;
        return res.status(200).json(otherDetails);
    } catch (error) {
        return res.status(500).json(error);
    }
}


export const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { currentUserId, currentUserAdminStatus, password } = req.body;
        if (id === currentUserId || currentUserAdminStatus) {
            if (password) {
                const salt = await genSalt(10);
                req.body.password = await hash(password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json(user);
        }
        else {
            return res.status(403).json({ message: "Access Denied" })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}


export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentUserId, currentUserAdminStatus } = req.body;
        if (id === currentUserId || currentUserAdminStatus) {
            await UserModel.findByIdAndDelete(id);
            return res.status(200).json("user successfully deleted")
        }
        else {
            return res.status(403).json({ message: "Access Denied" })
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const followUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.body;
        if (id === currentUserId) {
            res.status(403);
            throw new Error("action forbidden")
        }
        const followUser = await UserModel.findById(id);
        const followingUser = await UserModel.findById(currentUserId);

        if (!followUser.followers.includes(currentUserId)) {
            await followUser.updateOne({ $push: { followers: currentUserId } })
            await followingUser.updateOne({ $push: { following: id } });
        }
        return res.status(201).json({ message: "successfully followed user " });
    }
    catch (error) {
        next(error);
    }
}

export const UnFollowUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentUserId } = req.body;
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
    }
    catch (error) {
        next(error);
    }
}