import express from 'express';
import {
  createOrder, getMyOrders, getOrderById, requestPickup, requestExtension,
  updateOrderStatus, reportDamage, getVendorOrders, getAllOrders,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('customer'), createOrder);
router.get('/mine', restrictTo('customer'), getMyOrders);
router.get('/vendor/mine', restrictTo('vendor', 'admin'), getVendorOrders);
router.get('/admin/all', restrictTo('admin'), getAllOrders);
router.get('/:id', getOrderById);

router.post('/:id/pickup', restrictTo('customer'), requestPickup);
router.post('/:id/extend', restrictTo('customer'), requestExtension);
router.patch('/:id/status', restrictTo('vendor', 'admin'), updateOrderStatus);
router.post('/:id/damage', restrictTo('vendor', 'admin'), reportDamage);

export default router;
