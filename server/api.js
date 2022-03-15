const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db')
const service = require("./service")

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/products', async (request, response) => {
  response.send(await service.getAllProducts(request));
});

app.get('/products/search', async (request, response) => {
    response.send(await service.searchProcuts(request));
});

app.get('/products/:id', async (request, response) => {
  response.send(await service.findByProductId(request));
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);