import { Application, Request } from "express";

const productRoutes = require('./product-routes/product-routes');

const initRoutes = (app: Application) => {
    app.use('/products', productRoutes);
    app.all('*', (req: Request, res: any) => {
        return res.status(404).json({ 
            'status': false,
            'error': 'Invalid Route'
        });
    });
};

module.exports = initRoutes;
