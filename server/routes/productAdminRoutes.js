import express from "express";
import {
    createProductController,
    deleteProductController,
    updateProductController,
    getProductController
} from "../controllers/productAdminController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes

//get products
router.get("/get-product", getProductController);

//create product
router.post(
    "/create-product",
    requireSignIn,
    isAdmin,
    formidable(),
    createProductController
);

// update product
router.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController
);

//delete product
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);

export default router;
