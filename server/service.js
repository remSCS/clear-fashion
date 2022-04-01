const db = require("./db");



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

module.exports.loadClientProducts_V2 = async (request) => {
  let {  currentPage = 1, productsPerPage = 12, brand = "", price = 0 } = request.query;

  currentPage=parseInt(currentPage);
  productsPerPage=parseInt(productsPerPage);
  price=parseInt(price);

  const allProducts=await db.loadAllClientProducts();
  
  console.log(currentPage,productsPerPage,brand,price);
  
  // Create copy
  let result=[...allProducts];

  // Check if the price is equal to either -1, 0 or 1
  if(price!==-1 && price!==0 && price!==1){
    console.log("Invalid price sort");
    throw new Error("Invalid price sort");
  }

  // Check if the number of products per page is either 12, 24 or 48
  if(productsPerPage!==12 && productsPerPage!==24 && productsPerPage!==48){
    console.log("Invalid number of products per page");
    throw new Error("Invalid number of products per page");
  }
  
  // Check if the current page's type is int
  if(isNaN(parseInt(currentPage) <= 0 || parseInt(currentPage))){
    console.log("Cannot parse current page as a int number.")
    throw new Error("Cannot parse current page as a int number.")
  }

  // If we have to display a specific brand
  if(brand!==""){
    result=result.filter(x=>x.brand==brand)
  }

  // If we have to sort by price
  if(price!==0){
    if(price===-1){
      result.sort((a,b)=>{return b.price-a.price});
    }
    else{
      result.sort((a,b)=>{return a.price-b.price})
    }
  }

  

  //Now, we have our complete products list, let's check if the page that the user is asking is not above the max
  totalNbProducts=result.length;
  totalNbPages=Math.ceil(totalNbProducts/productsPerPage);
  if(currentPage>totalNbPages){
    console.log("Requested page is above the max");
    throw new Error("Requested page is above the max");
  }
  // Extract only the products from the requested page
  result=result.slice((currentPage-1)*productsPerPage,currentPage*productsPerPage);

  //Create pagination
  let final={"products":result,"meta":{"currentPage":currentPage,"TotalNbPages":totalNbPages,"nbProductsPerPage":productsPerPage,"totalNbProducts":totalNbProducts}};
  
  // Return the list
  
  return final;
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
