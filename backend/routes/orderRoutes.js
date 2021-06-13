import express from 'express'
import { addOrderItems, getMyOrders, getOrderById, getOrders, getReadyOrders, updateOrderToDelivered, updateOrderToPaid, updateOrderToReady, updateOrderToCancelled } from '../Controllers/orderController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myOrders').get(protect, getMyOrders)
router.route('/ready').get(protect, admin, getReadyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.route('/:id/ready').put(protect, admin, updateOrderToReady)
router.route('/:id/cancel').put(protect, updateOrderToCancelled)

export default router