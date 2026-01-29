const fs = require('fs')
const cloudinary = require('cloudinary').v2

// Configuration
cloudinary.config({
    cloud_name: 'dbsimzeri',
    api_key: '181995559837439',
    api_secret: 'WyzW3MQNJ_Z4lubHTVYNRXMNQX0'
});

const uploadOnCloudinary  = async (filePath) => {
    try {
        if(!filePath) return null;

        //upload thie file on cloudinary
        const response = await cloudinary.uploader.upload(filePath, {resource_type: "auto"});

        console.log("file uploaded on cloudinary", response);

        return response       
        
    } catch (error) {
        fs.unlinkSync(filePath); // remove the local temporery file
        return null;        
    }






    const uploadResult = await cloudinary.uploader
        .upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', { public_id: 'shoes', })
        .catch((error) => {
            console.log(error);
        });


    return uploadResult
}

module.exports = uploadOnCloudinary 


// (async function () {

//     // Configuration
//     cloudinary.config({
//         cloud_name: 'dbsimzeri',
//         api_key: '181995559837439',
//         api_secret: 'WyzW3MQNJ_Z4lubHTVYNRXMNQX0'
//     });

//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//         .upload(
//             'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//         )
//         .catch((error) => {
//             console.log(error);
//         });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);
// })();