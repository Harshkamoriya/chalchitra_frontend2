import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";


const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'gigs',
        allowed_formats:['jpg' ,'jpeg', 'png','mp4', 'pdf'],
        transformation:[{width:800 , height:600 , crop:'limit'}],
    },
    
})

const upload = multer({storage});
export default upload;