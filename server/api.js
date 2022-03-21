const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const service = require("./service")

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/products', async (request, response) => {
    try{
        let resp = await service.getAllProducts(request);
        response.send(resp);
    }
    catch(e){
        response.sendStatus(404);
    }
});

app.get('/products/search', async (request, response) => {
    try{
        let resp = await service.searchProducts(request);
        response.send(resp);
    }
    catch(e){
        switch (e.message){
            case "Cannot parse price as float number":
                response.status(404).send("Check your price.");
                break;
            case 'Cannot parse limit as int number':
                response.status(404).send("Check your limit.");
                break;
            default:
                response.sendStatus(404);
                break;
        }
    }
});

app.get('/products/:id', async (request, response) => {
    try {
        let resp = await service.findByProductId(request)
        response.send(resp);
    }
    catch (e){
        if(e.message === 'Non existing product.'){
            response.status(404).send("This product doesn't exist");
        }
    }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
