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

module.exports.loadClientProducts = async (request) => {
  const { size = 12, page = 1, brand = "" } = request.query;
  if (parseInt(size) <= 0 || isNaN(parseInt(size)))
    throw new Error("Cannot parse limit as a int number.");

  if (parseInt(page) <= 0 || isNaN(parseInt(page)))
    throw new Error("Cannot parse page as a int number.");

  console.log(brand, size, page);
  return db.loadClientProducts(
    brand ? { brand: brand } : {},
    parseInt(size),
    parseInt(page)
  );
};

module.exports.loadClientProducts_filtered = async (request) => {
  const { size = 12, page = 1, brand = "", price = 1 } = request.query;

  if (parseInt(size) <= 0 || isNaN(parseInt(size)))
    throw new Error("Cannot parse limit as a int number.");

  if (parseInt(page) <= 0 || isNaN(parseInt(page)))
    throw new Error("Cannot parse page as a int number.");

  if (isNaN(parseInt(price)) || (parseInt(price) != -1 && parseInt(price) != 1))
    throw new Error("Cannot parse price as a float number.");

  return db.loadClientProducts_filtered(
    brand ? { brand: brand } : {},
    { price: parseInt(price) },
    parseInt(size),
    parseInt(page)
  );
};
