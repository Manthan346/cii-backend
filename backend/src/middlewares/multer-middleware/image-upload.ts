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

// Helper: write a multer memory buffer to a safe temp file, upload to Cloudinary, then clean up
const uploadBufferToCloudinary = async (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname) || "";
  const safeName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext}`;
  const tempFilePath = path.join(os.tmpdir(), safeName);

  await fs.promises.writeFile(tempFilePath, file.buffer);

  try {
    return await uploadCloudnary(tempFilePath);
  } finally {
    // Always clean up the temp file, even if the upload throws
    await fs.promises.unlink(tempFilePath).catch(() => {
      // Ignore cleanup errors (e.g. file already gone) — don't mask the real error
    });
  }
};

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

      try {
        const uploadPromises = req.files.map((file: any) => uploadBufferToCloudinary(file));
        const results = await Promise.all(uploadPromises);

        // Extract secure URLs from results
        const imageUrls = results
          .filter((result): result is { secure_url: string } => result !== null && result.secure_url !== undefined)
          .map(result => result.secure_url);

        // Add Cloudinary URLs to request body as event_images array
        req.body.event_images = imageUrls;

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

// Middleware to handle single job posting image upload and upload to Cloudinary
export const uploadJobImage = async (req: any, res: any, next: any) => {
  try {
    // Handle single file upload with field name 'job_image'
    const uploadSingle = upload.single('job_image');

    uploadSingle(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      // If no file was uploaded, continue to next middleware (job_image stays unchanged)
      if (!req.file) {
        return next();
      }

      try {
        const result = await uploadBufferToCloudinary(req.file);

        if (result?.secure_url) {
          // Inject the uploaded URL into the body so downstream validation/controller
          // logic treats it exactly like any other field in updatePlacementSchema
          req.body.job_image = result.secure_url;
        }

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