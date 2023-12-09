import multer from 'multer';
import { nanoid } from 'nanoid';

// stores the photo in the selected path, add to the name of the photo an id

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/images")
    },
    filename: (req, file, cb) => {
        cb(null, `${nanoid()}__${file.originalname}`);
    }
})

export const upload = multer({ storage });