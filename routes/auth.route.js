import express from 'express';

import {
  singUpValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator
} from '../utils/validators/authValidator.js';
import { 
  signUp,
  login,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword
} from '../services/auth.service.js';

const router = express.Router();

router.post('/signup', singUpValidator, signUp);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPasswordValidator, forgotPassword);
router.post('/verifyResetCode', verifyResetCodeValidator, verifyPasswordResetCode);
router.put('/resetPassword', resetPasswordValidator, resetPassword);

export default router;
