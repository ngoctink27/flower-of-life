import express from 'express';
import {
    getOrdersController,
    createOrderController,
    deleteOrderController
} from "../controllers/orderController.js";
import { getAllOrdersController, orderStatusController }
    from "../controllers/orderAdminController.js"
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

// routing
// orders
router.get("/orders", requireSignIn, getOrdersController);
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);
router.post("/create-order", requireSignIn, createOrderController);
router.delete("/delete-order/:id", requireSignIn, deleteOrderController);



export default router;