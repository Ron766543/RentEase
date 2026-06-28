import express from 'express';
import {
  createMaintenanceRequest, getMyMaintenanceRequests, getVendorMaintenanceRequests,
  updateMaintenanceStatus, getAllMaintenanceRequests,
} from '../controllers/maintenanceController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('customer'), createMaintenanceRequest);
router.get('/mine', restrictTo('customer'), getMyMaintenanceRequests);
router.get('/vendor/mine', restrictTo('vendor', 'admin'), getVendorMaintenanceRequests);
router.get('/admin/all', restrictTo('admin'), getAllMaintenanceRequests);
router.patch('/:id', restrictTo('vendor', 'admin'), updateMaintenanceStatus);

export default router;
