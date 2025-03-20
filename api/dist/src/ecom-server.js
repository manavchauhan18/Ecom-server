import express from 'express';
const initRoutes = require('./routes/init-routes');
const { loadLogger, loadRequestParsers } = require('../scripts/init-server');
const app = express();
const port = 3000;
loadLogger(app);
loadRequestParsers(app);
initRoutes(app);
app.listen(port, () => {
    console.log("Ecom-server running on port ", port);
});
