import multer from "multer";
import os from "os";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { uploadCloudnary } from "../../services/cloudinary";

// Memory storage for multer to handle file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const isImageMimetype = file.mimetype && file.mimetype.toLowerCase().startsWith('image/');

    let isImageExtension = false;
    if (file.originalname && typeof file.originalname === 'string') {
      try {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        isImageExtension = allowedExtensions.includes(ext);
      } catch (e) {
        // If path.extname fails for any reason, treat as not an image by extension
        isImageExtension = false;
      }
    }

    if (isImageMimetype || isImageExtension) {
      cb(null, true);
      return;
    }

    // Provide detailed error for debugging
    const mimetypeInfo = file.mimetype ? `"${file.mimetype}"` : 'undefined';
    const originalnameInfo = file.originalname ? `"${file.originalname}"` : 'undefined';
    let extensionInfo = '';
    if (file.originalname && typeof file.originalname === 'string') {
      try {
        const ext = path.extname(file.originalname).toLowerCase();
        extensionInfo = `"${ext}"`;
      } catch (e) {
        extensionInfo = 'undefined (path error)';
      }
    } else {
      extensionInfo = 'no originalname or not string';
    }

    cb(new Error(`Only image files are allowed! Received mimetype: ${mimetypeInfo}, originalname: ${originalnameInfo}, extension: ${extensionInfo}`), false);
  }
});

// Middleware to handle multiple image upload (up to 10 images) and upload to Cloudinary
export const uploadEventImages = async (req: any, res: any, next: any) => {
  try {
    // Handle multiple file upload with field name 'event_images' (array)
    const uploadArray = upload.array('event_images', 10); // Max 10 files

    uploadArray(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      // If no files were uploaded, continue to next middleware
      if (!req.files || req.files.length === 0) {
        return next();
      }

      // Upload all files to Cloudinary
      try {
        const uploadPromises = req.files.map(async (file: any) => {
          // Build a safe, unique temp file path that works on Windows, Linux, and Mac
          const ext = path.extname(file.originalname) || "";
          const safeName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext}`;
          const tempFilePath = path.join(os.tmpdir(), safeName);

          // Write buffer to temporary file
          await fs.promises.writeFile(tempFilePath, file.buffer);

          try {
            // Upload to Cloudinary using existing service
            const result = await uploadCloudnary(tempFilePath);
            return result;
          } finally {
            // Always clean up the temp file, even if the upload throws
            await fs.promises.unlink(tempFilePath).catch(() => {
              // Ignore cleanup errors (e.g. file already gone) — don't mask the real error
            });
          }
        });

        const results = await Promise.all(uploadPromises);

        // Extract secure URLs from results
        const imageUrls = results
          .filter((result): result is { secure_url: string } => result !== null && result.secure_url !== undefined)
          .map(result => result.secure_url);

        // Add Cloudinary URLs to request body as event_images array
        req.body.event_images = imageUrls;

        // Continue to next middleware
        next();
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error processing image upload'
    });
  }
};

export default upload;