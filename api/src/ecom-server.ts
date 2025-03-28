import express, { json, urlencoded } from 'express';
import { connectDB } from '../database/connection';

const initRoutes = require('./routes/init-routes');
const { loadLogger, loadRequestParsers } = require('../scripts/init-server');
const app = express();
const port = process.env.SERVER_PORT || 3000;

async function startServer() {
    await connectDB();

    await loadLogger(app);
    await loadRequestParsers(app);
    await initRoutes(app);

    app.listen(port, () => {
        console.log("Ecom-server running on port", port);
    });
}

startServer();
