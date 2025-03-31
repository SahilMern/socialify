import {v1 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
dotenv.config({})

cloudinary.config({ 
    cloud_name: 'dt2zvo07s', 
    api_key: '188685278555167', 
    api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
});


export default cloudinary