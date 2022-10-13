import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default:
        "http://res.cloudinary.com/dzkabey31/image/upload/v1665075963/j0t8prgyo8pdvbgfawzz.png",
    },
    coverPicture: {
      type: String,
      default:
        "http://res.cloudinary.com/dzkabey31/image/upload/v1665076051/mebgmyon3jvsw0tdrn3k.jpg",
    },
    about: String,
    livesIn: String,
    worksAt: String,
    relationship: String,
    country: String,
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    Notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
