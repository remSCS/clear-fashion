/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require("./sites/dedicatedbrand");
const loom = require("./sites/loom");
const db = require("./db");

async function sandbox() {
  try {
    let products = [];
    let pages = [
      "https://www.dedicatedbrand.com/en/men/basics",
      "https://www.dedicatedbrand.com/en/men/sale",
      "https://www.dedicatedbrand.com/en/women/underwear",
      "https://www.dedicatedbrand.com/en/women/swimwear",
      "https://www.dedicatedbrand.com/en/women/dresses",
      "https://www.dedicatedbrand.com/en/kids/swimwear",
    ];

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await dedicatedbrand.scrape(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = [
      "https://www.loom.fr/collections/hauts-homme",
      "https://www.loom.fr/collections/bas-homme",
    ];

    console.log("\n");

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with Promise.all`);

    const promises = pages.map((page) => loom.scrape(page));
    const results = await Promise.all(promises);

    console.log(`👕 ${results.length} results of promises found`);
    console.log(`👕 ${results.flat().length} products found`);

    console.log(results);
    console.log(results.flat());

    products.push(results.flat());
    products = products.flat();

    console.log("\n");

    console.log(`👕 ${products.length} total of products found`);

    console.log("\n");

    const result = await db.insert(products);

    console.log(`💽  ${result.insertedCount} inserted products`);
    console.log("\n");

    // console.log("💽  Find Loom products only");

    // Requete 1: Find all products related to a given brands
    // const loomOnly = db.find_sort_limit({ brand: "loom" });
    // console.log(`👕 ${loomOnly.length} total of products found for Loom`);
    // console.log(loomOnly);

    // Requete 2: Find all products less than a price
    // const lessThan50 = db.find({ price: { $lt: 50 } });
    // console.log(
    //   `💰 ${lessThan50.length} total of products found with a price < 50€`
    // );
    // console.log(lessThan50);

    // Requete 3: Find all products sorted by price
    // const sortProduct = await db.find_sort_limit({}, { price: 1 });
    // console.log(`📚 ${sortProduct.length} total of products sorted`);
    // console.log(sortProduct);
    //
    // console.log(`👕 ${loomOnly.length} total of products found for Loom`);
    // console.log(loomOnly);

    db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();
