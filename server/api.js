const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db')

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/products', async (request, response) => {
  const products = await db.find();
  response.send(products);
});

app.get('/products/search', async (request, response) => {
  let query = {};
  let respValue = {};

  if(request.query.brand != undefined) {
    query["brand"] = request.query.brand;
  }

  if(request.query.price != undefined){
    query["price"] = {$lte: parseFloat(request.query.price)};
  }

  console.log(query);

  let found = await db.sort(query, {"price": 1})

  if(request.query.limit != undefined){
    respValue["limit"] = parseInt(request.query.limit);
    respValue["total"] = found.length;
    respValue["results"] = found.slice(0, request.query.limit);
  }
  else{
    respValue["limit"] = 12;
    respValue["total"] = found.length;
    respValue["results"] = found.slice(0, 12);
  }

  response.send(respValue);
});

app.get('/products/:id', async (request, response) => {
  const products = await db.find({_id: request.params.id});
  response.send(products);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);