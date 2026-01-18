import express from 'express';

import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator
} from '../utils/validators/userValidator.js';
import { 
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadUserImage,
  resizeImage,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} from '../services/user.service.js';
import protect from '../middlewares/protect.js';
import allowedTo from '../middlewares/allowedTo.js';

const router = express.Router();

router.use(protect);

// Logged User
router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', changeLoggedUserPasswordValidator, updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);

// Admin
router.use(allowedTo('admin'));

router.put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword)

router.route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)

router.route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser)

export default router;
