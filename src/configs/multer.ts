import multer from "multer";
import path from 'path';
import crypto from 'crypto';

export const configMulterItems = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = crypto.randomBytes(8).toString('hex');

            const filename = `${hash}-${file.originalname}`;

            callback(null, filename);
        }
    })
}

export const configMulterLocations = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads', 'locations'),
        filename(request, file, callback) {
            const hash = crypto.randomBytes(8).toString('hex');

            const filename = `${hash}-${file.originalname}`;

            callback(null, filename);
        }
    })
}