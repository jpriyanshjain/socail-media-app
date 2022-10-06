import { Router } from "express";
import fileUpload from "express-fileupload";
import path from "path";
import cloudinary from "cloudinary";

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", async (req, res, next) => {
  try {
    const image = req.files.image.tempFilePath;
    const { url } = await cloudinary.v2.uploader.upload(image);
    res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

export default router;
