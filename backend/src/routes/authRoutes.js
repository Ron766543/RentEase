import express from 'express';
import {
  register, login, logout, getMe, updateMe, addAddress, deleteAddress,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidator, loginValidator } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.post('/me/addresses', protect, addAddress);
router.delete('/me/addresses/:addressId', protect, deleteAddress);

export default router;
