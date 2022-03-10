/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart');

async function dedicatedScrape (eshop = 'https://www.dedicatedbrand.com/en/') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function montlimartScrape (eshop = 'https://www.montlimart.com/accessoires.html') {
    try {
        console.log(`🕵️‍♀️  browsing ${eshop} source`);

        const products = await montlimart.scrape(eshop);

        products.forEach(element => console.log(element));

        console.log(products);
        console.log('done');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

const [,, eshop] = process.argv;

dedicatedScrape(eshop);
montlimartScrape(eshop);