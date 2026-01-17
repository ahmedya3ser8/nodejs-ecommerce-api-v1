import express from 'express';

import {
  singUpValidator,
  loginValidator
} from '../utils/validators/authValidator.js';
import { 
  signUp,
  login
} from '../services/auth.service.js';

const router = express.Router();

router.route('/signup').post(singUpValidator, signUp);
router.route('/login').post(loginValidator, login);

export default router;
