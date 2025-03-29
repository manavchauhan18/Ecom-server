import { Request, Response } from "express";
import product from "../database/schemas/product.schema";
import { successResponse, failResponse } from "../scripts/responseStatus";
import Product from "../database/schemas/product.schema";
import { elasticConnection } from "../config/elasticSearch";
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

        let product = await Product.findOne({ name });

        if(product) {
            if(product.deleteStatus) {
                Object.assign(product, { deleteStatus: false, price, description, category, stock, value });
            } else {
                errors.duplicate = "Duplicate entry found."
                failResponse(res, "The product already exists", 400, errors);
                return;
            }
        } else {
            product = new Product({ name, price, description, category, stock, value });
        }

        await product.save();
        const { _id, ...elasticProduct } = product.toObject();

        await redis.set(`product:${product._id}`, JSON.stringify(product), "EX", 86400);

        await elasticConnection.index({
            index: "products",
            id: product._id.toString(),
            document: elasticProduct
        });
        await clearPaginatedCache();

        successResponse(res, product, "Product created successfully", 201); 
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

        await elasticConnection.update({
            index: 'products',
            id: id,
            doc: updateData
        })

        await redis.set(`product:${id}`, JSON.stringify(updatedProduct), "EX", 86400);
        await clearPaginatedCache();
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

        await elasticConnection.delete({
            index: "products",
            id: id,
        });

        await redis.set(`product:${id}`, JSON.stringify(updatedProduct), "EX", 86400);
        await clearPaginatedCache();
        successResponse(res, updatedProduct, "Product deleted successfully", 201); 
        return;

    } catch (err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

const getSearchedProduct = ( req: Request, res: Response ) => {
    try {
        let trySys = new elasticConnection();
        console.log(trySys);
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
    deleteProduct,
    getSearchedProduct
}