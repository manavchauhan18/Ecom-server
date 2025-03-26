import { Request, Response } from "express";
import product from "../database/schemas/product.schema";
import { successResponse, failResponse } from "../scripts/utilities";
import Product from "../database/schemas/product.schema";

const listProducts = async (req: Request, res: Response) => {
    res.send("Product List");
}

const getProductById = async (req: Request, res: Response) => {
    console.log(req.params);
    res.send('A product');
}

const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, description, category, stock } = req.body;
        const errors: any = {};

        if (!name || typeof name !== "string" || name.length < 3) {
            errors.name = "Name must be at least 3 characters long.";
        }

        if (!price || typeof price !== "number" || price <= 0) {
            errors.price = "Price must be a positive number.";
        }

        if (!category || typeof category !== "string" || category.length < 3) {
            errors.category = "Category must be at least 3 characters long.";
        }

        if (stock !== undefined && (typeof stock !== "boolean")) {
            errors.stock = "Stock must be a boolean value.";
        }

        if (Object.keys(errors).length > 0) {
            failResponse(res, "Validation failed", 400, errors);
            return;
        }

        const existingProduct = await Product.findOne({ name });
        if(existingProduct) {
            errors.duplicate = "Duplicate entry found."
            failResponse(res, "The product already exists", 400, errors);
            return;
        }

        const newProduct = new product({ name, price, description, category, stock });
        await newProduct.save();

        successResponse(res, newProduct, "Product created successfully", 201);   
        return;
    } catch (err) {
        console.log(err);
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, description, category, stock } = req.body;
    const errors: any = {};

    if (!name || typeof name !== "string" || name.length < 3) {
        errors.name = "Name must be at least 3 characters long.";
    }

    if (!price || typeof price !== "number" || price <= 0) {
        errors.price = "Price must be a positive number.";
    }

    if (!category || typeof category !== "string" || category.length < 3) {
        errors.category = "Category must be at least 3 characters long.";
    }

    if (stock !== undefined && (typeof stock !== "boolean")) {
        errors.stock = "Stock must be a boolean value.";
    }

    if (Object.keys(errors).length > 0) {
        failResponse(res, "Validation failed", 400, errors);
        return;
    }

    const existingProduct = await product.findById(id);

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