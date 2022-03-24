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
  const { limit = 12, page = 1 } = request.query;

  if (limit <= 0 || isNaN(parseInt(limit))) {
    throw new Error("Cannot parse limit.");
  }

  if (page <= 0 || isNaN(parseInt(page))) {
    throw new Error("Cannot parse page.");
  }

  return db.loadPage(parseInt(limit), parseInt(page));
};
