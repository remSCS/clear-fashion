const fs=require("fs");

// DEDICATED BRAND

const dedicatedbrand = require('./sources/dedicatedbrand');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);

    var products_json=JSON.stringify(products.flat());
    fs.writeFileSync("products_dedicatedbrand.json",products_json);

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);




// MONTLIMART

// const montlimart = require('./sources/montlimart');

// async function sandbox (eshop = 'https://www.montlimart.com/polos-t-shirts.html') {
//   try {
//     console.log(`🕵️‍♀️  browsing ${eshop} source`);

//     const products = await montlimart.scrape(eshop);

//     console.log(products);

//     var products_json=JSON.stringify(products.flat());
//     fs.writeFileSync("products_montlimart.json",products_json);

//     console.log('done');
//     process.exit(0);
//   } catch (e) {
//     console.error(e);
//     process.exit(1);
//   }
// }

// let [,, eshop] = process.argv;

// sandbox(eshop);






// ADRESSE PARIS


// const adresse = require('./sources/adresse');

// async function sandbox (eshop = 'https://adresse.paris/583-manteaux-et-blousons') {
//   try {
//     console.log(`🕵️‍♀️  browsing ${eshop} source`);

//     const products = await adresse.scrape(eshop);

//     console.log(products);

//     var products_json=JSON.stringify(products.flat());
//     fs.writeFileSync("products_adresse.json",products_json);

//     console.log('done');
//     process.exit(0);
//   } catch (e) {
//     console.error(e);
//     process.exit(1);
//   }
// }

// let [,, eshop] = process.argv;

// sandbox(eshop);