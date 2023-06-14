import multer from 'multer';
import { nanoid } from 'nanoid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/images")
    },
    filename: (req, file, cb) => {
        cb(null, `${nanoid()}__${file.originalname}`);
    }
})

export const upload = multer({ storage });