import express from 'express';
import {
  getProducts, getProductBySlug, getCategoryFacets,
  createProduct, updateProduct, deleteProduct, getVendorProducts,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/facets', getCategoryFacets);
router.get('/vendor/mine', protect, restrictTo('vendor', 'admin'), getVendorProducts);
router.get('/:slug', getProductBySlug);

router.post('/', protect, restrictTo('vendor', 'admin'), createProduct);
router.patch('/:id', protect, restrictTo('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, restrictTo('vendor', 'admin'), deleteProduct);

export default router;
