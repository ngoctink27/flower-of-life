// routes/cart.js
import express from "express";
const router = express.Router();
import {
    getCartByUserId,
    addToCart,
    updateCartItem,
    deleteAllItems
} from "../controllers/cartController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

router.get('/', requireSignIn, getCartByUserId);
router.post('/add', requireSignIn, addToCart);
router.put('/update/:cartItemId', requireSignIn, updateCartItem);
router.delete('/deleteAll', requireSignIn, deleteAllItems);

export default router;