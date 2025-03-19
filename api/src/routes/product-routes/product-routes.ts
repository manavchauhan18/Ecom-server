import { Router } from "express";
import productController from "../../../controllers/products-controller";
const router = Router();

router.get("/", productController.listProducts);

router.get("/:id", productController.getProductById)

module.exports = router; 