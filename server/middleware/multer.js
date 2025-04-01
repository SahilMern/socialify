import multer from "multer";
const upload = multer({
    storage:multer.memoryStorage()
})

export default upload
// const storage = multer.diskStorage({
//     filename:(cb, )
// })