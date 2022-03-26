/* eslint-disable no-console, no-process-exit */
const service = require("./sandbox_service");
const db = require("../db");
const data_json = require("./sites/sites.json");
const { each } = require("cheerio/lib/api/traversing");

async function sandbox() {
  try {
    const websites = ["dedicated", "loom", "adresse", "montlimart"];
    const data = data_json;
    let total = [];

    console.log(`🕵️‍♀ Browsing ${websites.length} websites...`);

    for (let website of websites) {
      console.log(`🕵️‍♀ Scraping ${website}`);
      let result = await service.scrape(website, data[website]);
      total.push(result);
    }
    console.log("🕵️‍♀ Scraping done!\n");
    console.log(`👕 ${total.length} total of products found\n`);

    const result = await db.insert(total.flat());
    console.log(`💽  ${result.insertedCount} inserted products\n`);

    await db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();
