const fs = require('fs');
const cloudinary = require('cloudinary').v2

// Configuration
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

const uploadOnCloudinary  = async (filePath) => {
    try {        
        if(!filePath) return null;

        //upload thie file on cloudinary
        const response = await cloudinary.uploader.upload(filePath, {resource_type: "auto"});
        fs.unlinkSync(filePath) // remove the local temporery file

        return response.url       

    } catch (error) {
        fs.unlinkSync(filePath); // remove the local temporery file
        return null;        
    }
}



module.exports = uploadOnCloudinary 