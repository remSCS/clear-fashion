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
    let products = db.find({_id: id});
    if(products.length === 0){
        throw new Error('Non existing product.');
    }
    else{ return products; }
}

module.exports.loadAllProductsWithPage = async request => {
    let product_list = {};
    let limit = request.query.limit;
    let page = request.query.page;

    if (limit === undefined) limit = 12;
    else {
        if (limit <= 0 || isNaN(parseInt(limit))){
            throw new Error("Cannot parse limit.");
        }
    }

    if (page === undefined) page = 1;
    else{
        if (page <= 0 || isNaN(parseInt(page))){
            throw new Error("Cannot parse page.");
        }
    }

    product_list = await db.loadPage(parseInt(limit), parseInt(page));
    return product_list
}