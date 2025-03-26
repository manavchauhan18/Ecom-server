import { Request, Response, NextFunction } from "express";
import { successResponse, failResponse } from "../scripts/responseStatus";

export const validateData = ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { name, price, description, category, stock, value } = req.body;
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

        if(value !== undefined && (typeof value !== "number")) {
            errors.value = "Value must of type integer";
        } else {
            if(stock === false) {
                errors.value = "The value for stock is false";
            } else if(stock === true && value <= 0) {
                errors.value = "Value must be valid.";
            }
        }

        if (Object.keys(errors).length > 0) {
            failResponse(res, "Validation failed", 400, errors);
            return;
        }

        next();
    } catch(err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}