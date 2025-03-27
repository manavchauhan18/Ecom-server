import { Request, Response } from "express";
import product from "../database/schemas/product.schema";
import { successResponse, failResponse } from "../scripts/responseStatus";
import Product from "../database/schemas/product.schema";
import redis from "../config/redisClient";
import { clearPaginatedCache } from "../middlewares/utils";

const listProducts = async (req: Request, res: Response) => {
    try {
        const { page } = req.params;
        const limit = 10;
        const pageNumber = parseInt(page as string) || 1;

        const redisKey = `products:page:${pageNumber}`;
        const cachedData = await redis.get(redisKey);

        if (cachedData) {
            successResponse(res, JSON.parse(cachedData), "Products fetched from cache", 200);
            return;
        }

        const products = await Product.find({ deleteStatus: false })
            .skip((pageNumber - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalProducts = await Product.countDocuments({ deleteStatus: false });
        const totalPages = Math.ceil(totalProducts / limit);

        const responseData = {
            products,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalProducts,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1,
            }
        };

        await redis.set(redisKey, JSON.stringify(responseData), "EX", 300);

        successResponse(res, responseData, "Products fetched successfully", 200);
        return;
    } catch (err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
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
            if(existingProduct.deleteStatus === true) {
                existingProduct.deleteStatus = false;
                existingProduct.price = price;
                existingProduct.description = description;
                existingProduct.category = category;
                existingProduct.stock = stock;
                existingProduct.value = value;

                await existingProduct.save();
                await redis.set(`product:${existingProduct._id}`, JSON.stringify(existingProduct), "EX", 86400);

                successResponse(res, existingProduct, "Product created successfully", 201);
                return;
            } else {
                errors.duplicate = "Duplicate entry found."
                failResponse(res, "The product already exists", 400, errors);
                return;
            }
        }

        const newProduct = new product({ name, price, description, category, stock, value });
        if(newProduct) {
            const productId = newProduct._id;
            await redis.set(`product:${productId}`, JSON.stringify(newProduct), "EX", 86400);
        }

        await newProduct.save();

        successResponse(res, newProduct, "Product created successfully", 201); 
        return;
    } catch (err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, stock, value } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (price) updateData.price = price;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (stock) updateData.stock = stock;
        if (value) updateData.value = value;
        const errors: any = {};

        const updatedProduct = await Product.findOneAndUpdate(
            {"_id": id},
            {$set: updateData},
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            errors.notFound = 'Product not found in store';
            failResponse(res, "Product not found", 500, errors);
            return;
        }

        await redis.set(`product:${id}`, JSON.stringify(updatedProduct), "EX", 86400);
        successResponse(res, updatedProduct, "Product updated successfully", 201); 
        return;

    } catch (err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const errors: any = {};

        const updatedProduct = await Product.findOneAndUpdate(
            {"_id": id},
            {$set: { deleteStatus: true }},
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            errors.notFound = 'Product not found in store';
            failResponse(res, "Product not found", 500, errors);
            return;
        }

        await redis.set(`product:${id}`, JSON.stringify(updatedProduct), "EX", 86400);
        successResponse(res, updatedProduct, "Product deleted successfully", 201); 
        return;

    } catch (err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

export default {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}