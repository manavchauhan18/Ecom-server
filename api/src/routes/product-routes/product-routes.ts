import { Router } from "express";
import productController from "../../../controllers/products-controller";
import { validateData } from "../../../middlewares/validateData";
import { rateLimiter, getDataFromRedis } from "../../../middlewares/utils";

const router = Router();

router.get("/listproduct/page/:page", productController.listProducts);
router.get("/productid/:id", rateLimiter, getDataFromRedis('product'), productController.getProductById);
router.post("/create", validateData, productController.addProduct);
router.delete('/deleteproductbyid/:id', productController.deleteProduct);
router.put('/updateproduct/:id', validateData, productController.updateProduct); 

module.exports = router; 