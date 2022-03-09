import fs, { PathLike } from 'fs';

export const removeFile = (filePath: PathLike) => {
    fs.unlink(filePath, (error) => {
        if (error) throw error;
        console.log(`${filePath} was removed!`);
    });
};
