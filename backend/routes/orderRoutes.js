import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById,
  getAllOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new order
router.post('/', createOrder);
router.get('/getAllOrders', getAllOrders);
// Get all orders for the logged-in user
router.get('/myorders', protect, getMyOrders);

// Get a specific order by ID
router.get('/:id', protect, getOrderById);


export default router;
