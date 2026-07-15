import { v2 as cloudnary } from "cloudinary";
import fs from "fs"


cloudnary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
})

//file upload logic to cloudnary
export const uploadCloudnary = async(localFilePath: string) => {

   try {
   const response =  cloudnary.uploader.upload(localFilePath, {
        resource_type: "auto"
 
     })
     
     console.log("file uploaded successfully", response)
     return response
   } catch (error: any) {
    fs.unlinkSync(localFilePath)
    

    console.log(error.message)
    return null
    
   }


}