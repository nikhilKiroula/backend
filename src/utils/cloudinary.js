import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("File path not found !!");
            return null
        }

        //  upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        // file has been uploaded successfully
        // console.log("file is uploaded on cloudinary", response.url);
        console.log("response from cloudinary", response);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary};


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) {
//             console.log("File path not found!!");
//             return null;
//         }

//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });

//         console.log("File uploaded on Cloudinary:", response.url);

//         return response;

//     } catch (error) {
//     console.log("🔥 CLOUDINARY ERROR MESSAGE:", error.message);
//     console.log("🔥 CLOUDINARY ERROR CODE:", error.http_code);
//     console.log("🔥 CLOUDINARY ERROR NAME:", error.name);
//     console.log("🔥 FULL ERROR:", error);

//     if (localFilePath && fs.existsSync(localFilePath)) {
//         fs.unlinkSync(localFilePath);
//     }

//     return null;
// }
// };



// export {uploadOnCloudinary}