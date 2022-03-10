/* eslint-disable no-console, no-process-exit */
const fs = require("fs");
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart');
const adresse = require('./sources/adresse');

async function dedicatedScrape (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
    try {
        console.log(`🕵️‍♀️  browsing ${eshop} source`);

        const products = await dedicatedbrand.scrape(eshop);

        console.log(products);

        var products_json = JSON.stringify(products.flat());
        fs.writeFileSync("products_dedicatedbrand.json", products_json);

        console.log('done');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
async function montlimartScrape (eshop = 'https://www.montlimart.com/polos-t-shirts.html') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await montlimart.scrape(eshop);

    console.log(products);

    var products_json=JSON.stringify(products.flat());
    fs.writeFileSync("products_montlimart.json",products_json);

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}




async function adresseScrape (eshop = 'https://adresse.paris/583-manteaux-et-blousons') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await adresse.scrape(eshop);

    console.log(products);

    var products_json=JSON.stringify(products.flat());
    fs.writeFileSync("products_adresse.json", products_json);

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


const [,, eshop] = process.argv;

// dedicatedScrape(eshop);
// montlimartScrape(eshop);
adresseScrape(eshop)
