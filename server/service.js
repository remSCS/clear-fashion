const db = require("./db");

// get all products
module.exports.getAllProducts = async (request) => {
  return db.find();
};

// search for products (price, limit, brand)
module.exports.searchProducts = async (request) => {
  let query = {};
  const { brand = "all", price = "all", limit = 12 } = request.query;

  if (brand !== "all") query["brand"] = brand;

  if (price !== "all") {
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0)
      throw new Error("Cannot parse price as float number.");
    else query["price"] = { $lte: parseFloat(price) };
  }
  console.log("here");
  if (isNaN(parseInt(limit)) || parseInt(limit) < 0)
    throw new Error("Cannot parse limit.");

  return db.find_sort_limit(query, { price: 1 }, parseInt(limit));
};

// product by id
module.exports.findByProductId = async (request) => {
  const id = request.params.id;
  let products = db.find({ _id: id });
  if (products.length === 0) {
    throw new Error("Non existing product.");
  }

  return products;
};

module.exports.loadAllProductsWithPage = async (request) => {
  const { size  = 12, page = 1, brand = "", price=0 } = request.query;

  if (size <= 0 || isNaN(parseInt(size))) {
    throw new Error("Cannot parse size.");
  }

  if (page <= 0 || isNaN(parseInt(page))) {
    throw new Error("Cannot parse page.");
  }

  return db.loadPage(parseInt(size), parseInt(page));
};
