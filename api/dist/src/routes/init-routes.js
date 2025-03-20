const productRoutes = require('./product-routes/product-routes');
const initRoutes = (app) => {
    app.use('/products', productRoutes);
    app.all('*', (req, res) => {
        return res.status(404).json({
            'status': false,
            'error': 'Invalid Route'
        });
    });
};
module.exports = initRoutes;
export {};
