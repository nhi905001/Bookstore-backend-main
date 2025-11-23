import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getRevenueSummary,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, addOrderItems) // User can create an order
  .get(protect, admin, getOrders); // Admin can get all orders

router.route('/stats/summary').get(protect, admin, getRevenueSummary); // Admin stats endpoint

router.route('/myorders').get(protect, getMyOrders); // User can get their own orders

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').put(protect, admin, updateOrderStatus); // Admin can update order status

export default router;
