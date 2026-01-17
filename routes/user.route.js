import express from 'express';

import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator
} from '../utils/validators/userValidator.js';
import { 
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadUserImage,
  resizeImage
} from '../services/user.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.put('/changePassword/:id', protect, allowedTo('admin'), changeUserPasswordValidator, changeUserPassword)

router.route('/')
  .get(protect, allowedTo('admin'), getUsers)
  .post(protect, allowedTo('admin'), uploadUserImage, resizeImage, createUserValidator, createUser)

router.route('/:id')
  .get(protect, allowedTo('admin'), getUserValidator, getUser)
  .put(protect, allowedTo('admin'), uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser)

export default router;
