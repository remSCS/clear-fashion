const db = require('./db')

// get all products
module.exports.getAllProducts = async request => {
    return await db.find();
}

// search for products (price, limit, brand)
module.exports.searchProducts = async request => {
    let query = {};
    let product_list = {};

    if(request.query.brand !== undefined) {
        query["brand"] = request.query.brand;
    }

    if(request.query.price !== undefined){
        if(isNaN(parseFloat(request.query.price))){
            throw new Error('Cannot parse price as float number');
        }
        else{
            query["price"] = {$lte: parseFloat(request.query.price)};
        }
    }

    let found = await db.sort(query, {"price": 1})

    if(request.query.limit !== undefined) {
        if(isNaN(parseInt(request.query.limit))) {
            throw new Error('Cannot parse limit as int number');
        }
        else{
            product_list["limit"] = parseInt(request.query.limit);
            product_list["total"] = found.length;
            product_list["results"] = found.slice(0, request.query.limit);
        }
    }
    else{
        product_list["limit"] = 12;
        product_list["total"] = found.length;
        product_list["results"] = found.slice(0, 12);
    }

    return product_list
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