import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

const getDataUri = (file) => {
  // file.buffer is provided by multer.memoryStorage()
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer); // -> { content: "data:<mime>;base64,..." }
};

export default getDataUri;
