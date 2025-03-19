import { Request, Response } from "express";

const listProducts = async (req: Request, res: Response) => {
    res.send("Product List");
}

const getProductById = async (req: Request, res: Response) => {
    console.log(req.params);
    res.send('A product');
}

const addProduct = async (req: Request, res: Response) => {
    res.send("Product Added");
}

const updateProduct = async (req: Request, res: Response) => {
    res.send("Product updated");
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