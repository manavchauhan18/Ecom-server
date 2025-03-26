import express, { Application, Request, Response, NextFunction } from "express";
import { failResponse } from "../../scripts/responseStatus";

const productRoutes = require('./product-routes/product-routes');

const initRoutes = (app: Application) => {
    const errors: any = {};
    app.use('/products', productRoutes);
    app.all('*', (req: Request, res: Response) => {
        errors.routeFailure = 'Invalid Route';
        failResponse(res, "Route Error", 404, errors);
        return;
    });
       
};

module.exports = initRoutes;
