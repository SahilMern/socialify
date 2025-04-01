import DataUriParser from "datauri/parser.js"
import path from "path"

const parser = new DataUriParser();
const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString()
    console.log(extName, "extName");
    // console.log(parser.format(extName, file.buffer).content);
    
    return parser.format(extName, file.buffer).content;
}

export default getDataUri;