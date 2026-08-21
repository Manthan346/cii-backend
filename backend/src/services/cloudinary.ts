import { v2 as cloudnary } from "cloudinary";
import fs from "fs"
import path from "path"


cloudnary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
})

//file upload logic to cloudnary
export const uploadCloudnary = async (localFilePath: string) => {
  // Handle empty path (no file uploaded)
  if (!localFilePath || localFilePath.trim() === '') {
    console.log('[Cloudinary] No file path provided, skipping upload');
    return null;
  }

  // Resolve to absolute path
  const absolutePath = path.resolve(localFilePath);
  console.log('[Cloudinary] Uploading file:', absolutePath);

  try {
    const response = await cloudnary.uploader.upload(absolutePath, {
      resource_type: "auto",
    });

    console.log('[Cloudinary] Upload successful:', response.secure_url);
    return response;
  } catch (error) {
    console.error('[Cloudinary] Upload error:', error);
    return null;
  } finally {
    // Clean up local file
    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log('[Cloudinary] Local file deleted:', absolutePath);
      } else {
        console.warn('[Cloudinary] Local file not found for cleanup:', absolutePath);
      }
    } catch (cleanupError) {
      console.error('[Cloudinary] Failed to delete local file:', cleanupError);
    }
  }
};