const fetch = require("node-fetch");
const cheerio = require("cheerio");

const dedicated = require("./sites/dedicatedbrand");
const loom = require("./sites/loom");
const montlimart = require("./sites/montlimart");
const adresse = require("./sites/adresse");

const fetch_dedicated = async (urls) => {
  let products = [];
  for (let i of urls) {
    products.push(await dedicated.scrape(i));
    console.log(products);
  }
  return products.flat();
};

const fetch_loom = async (urls) => {
  let products = [];
  for (let i of urls) {
    products.push(await loom.scrape(i));
    console.log(products);
  }
  return products.flat();
};

const fetch_adresse = async (urls) => {
  let products = [];
  for (let i of urls) {
    products.push(await adresse.scrape(i));
    console.log(products);
  }
  return products.flat();
};

const fetch_montlimart = async (urls) => {
  let products = [];
  for (let i of urls) {
    products.push(await montlimart.scrape(i));
    console.log(products);
  }
  return products.flat();
};

module.exports.scrape = async (str, urls) => {
  switch (str) {
    case "loom":
      return fetch_loom(urls);
    case "montlimart":
      return fetch_montlimart(urls);
    case "adresse":
      return fetch_adresse(urls);
    case "dedicated":
      return fetch_dedicated(urls);
    default:
      return;
  }
};
