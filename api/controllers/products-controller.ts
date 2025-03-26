import { Request, Response } from "express";
import product from "../database/schemas/product.schema";
import { successResponse, failResponse } from "../scripts/responseStatus";
import Product from "../database/schemas/product.schema";
import redis from "../config/redisClient";


const listProducts = async (req: Request, res: Response) => {
    res.send("Product List");
}

const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const errors: any = {};

        const dbData = await Product.findById(id);
        if(dbData) {
            await redis.set(`product:${id}`, JSON.stringify(dbData), "EX", 86400);
            successResponse(res, dbData, "Product found", 201);
            return; 
        } else {
            errors.notFound = 'Product with given id does not exist';
            failResponse(res, "Product not found", 400, errors);
            return;
        }
    } catch (err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, description, category, stock, value } = req.body;
        const errors: any = {};

        const existingProduct = await Product.findOne({ name });
        if(existingProduct) {
            errors.duplicate = "Duplicate entry found."
            failResponse(res, "The product already exists", 400, errors);
            return;
        }

        const newProduct = new product({ name, price, description, category, stock, value });
        await newProduct.save();

        successResponse(res, newProduct, "Product created successfully", 201); 
        return;
    } catch (err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

const updateProduct = async (req: Request, res: Response) => {
    // const { id, name, price, description, category, stock } = req.body;
    // const errors: any = {};

    // const existingProduct = await product.findById(id);

}

const deleteProduct = async (req: Request, res: Response) => {
    res.send("Product deleted");
}

export default {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}