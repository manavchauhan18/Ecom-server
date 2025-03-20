import express, { json, urlencoded } from 'express';
const initRoutes = require('./routes/init-routes');
const {
    loadLogger,
    loadRequestParsers
} = require('../scripts/init-server');
const app = express();
const port = 3000;

app.use(urlencoded({ extended: false }))
app.use(json());

loadLogger(app);
loadRequestParsers(app);
initRoutes(app);

app.listen(port, () => {
    console.log("Ecom-server running on port ", port);
})


