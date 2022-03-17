const db = require('./db')

// get all products
module.exports.getAllProducts = async request => {
    let products = await db.find();
    return products;
}

// search for products (price, limit, brand)
module.exports.searchProducts = async request => {
    let query = {};
    let returnValue = {};

    if(request.query.brand != undefined) {
        query["brand"] = request.query.brand;
    }

    if(request.query.price != undefined){
        query["price"] = {$lte: parseFloat(request.query.price)};
    }

    let found = await db.sort(query, {"price": 1})

    if(request.query.limit != undefined){
        returnValue["limit"] = parseInt(request.query.limit);
        returnValue["total"] = found.length;
        returnValue["results"] = found.slice(0, request.query.limit);
    }
    else{
        returnValue["limit"] = 12;
        returnValue["total"] = found.length;
        returnValue["results"] = found.slice(0, 12);
    }

    return returnValue
}

// product by id
module.exports.findByProductId = async request => {
    const id = request.params.id;
    let products = await db.find({_id: id});
    if(products.length === 0){
        throw new Error('Non existing product.');
    }
    else{ return products; }
}