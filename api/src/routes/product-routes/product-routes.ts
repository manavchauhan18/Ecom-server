import { Router } from "express";
import productController from "../../../controllers/products-controller";
const router = Router();

router.get("/", productController.listProducts);
router.get("/productid/:id", productController.getProductById);
router.post("/create", productController.addProduct);
router.delete('/deleteproductbyid/:id', productController.deleteProduct);
router.put('/updateproduct/:id', productController.updateProduct)

module.exports = router; 