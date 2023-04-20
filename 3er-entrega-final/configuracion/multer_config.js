import multer from "multer";
import { __dirname } from "../server.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/public/images");
    },
    filename: (req, file, cb) => { 
      cb(null, Date.now() + "-" + file.originalname)
  }
});
  
export const upload = multer({ storage });