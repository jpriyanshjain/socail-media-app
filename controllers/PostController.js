import mongoose from "mongoose";
import postModel from "../models/postMode.js"
import UserModel from "../models/userModel.js";


export const createPost = async (req, res, next) => {
    try {
        const newPost = new postModel(req.body);
        await newPost.save();
        res.status(201).json("successfully created post")
    } catch (error) {
        next(error);
    }
}

export const getPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);
        if (!post) {
            res.status(404);
            throw new Error("post not found");
        }
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body;
        const post = await postModel.findById(postId);
        if (post.userId !== userId) {
            res.status(403);
            throw new Error("action forbidden");
        }
        await post.updateOne({ $set: req.body });
        return res.status(201).json("post successfully updated");
    } catch (error) {
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body;
        const post = await postModel.findById(postId);
        if (post.userId !== userId) {
            res.status(403);
            throw new Error("action forbidden");
        }
        await post.deleteOne();
        return res.status(200).json("post successfully deleted");
    } catch (error) {
        next(error);
    }
}


export const likePost = async (req, res, next) => {
    try {
        const { id: postId } = req.params;
        const { userId } = req.body;
        const post = await postModel.findById(postId);
        if (userId === post.userId) {
            res.status(403);
            throw new Error("action forbidden");
        }
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            return res.status(201).json('post successfully liked')
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            return res.status(201).json('post successfully unliked')
        }
    } catch (error) {
        next(error);
    }
}

export const getTimeLinePost = async (req, res, next) => {
    try {
        const { id: userId } = req.params;
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                },
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ]);
        const timelinePosts = followingPosts[0].followingPosts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });
        return res.status(200).json(timelinePosts);

    } catch (error) {
        next(error)
    }
}