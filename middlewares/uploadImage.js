import multer from 'multer';

import AppError from '../utils/appError.js'; 

const multerOptions = () => {
  // 1) DiskStorage
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'uploads/categories');
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = file.mimetype.split('/')[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   }
  // })
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType === 'image') {
      return cb(null, true);
    } else {
      return cb(new AppError('Only Images allowed', 400), false)
    }
  }

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
}

const uploadSingleImage = (fileName) => multerOptions().single(fileName);

const uploadMixOfImages = (arrOfFields) => multerOptions().fields(arrOfFields)

export {
  uploadSingleImage,
  uploadMixOfImages
}
