import express from 'express';
import {
  getAllUsers, updateUserStatus, getServiceAreas, createServiceArea,
  updateServiceArea, getDashboardStats,
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserStatus);
router.get('/service-areas', getServiceAreas);
router.post('/service-areas', createServiceArea);
router.patch('/service-areas/:id', updateServiceArea);
router.get('/dashboard-stats', getDashboardStats);

export default router;
