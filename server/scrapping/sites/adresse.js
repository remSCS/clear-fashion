const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { v5: uuidv5 } = require("uuid");

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = (data) => {
  const $ = cheerio.load(data);

  return $(".product_list .product-container")
    .map((i, element) => {
      let link = $(element).find(".product_img_link").attr("href");
      if (link === undefined) return;
      return {
        link,
        brand: "Adresse Paris",
        price: parseFloat(
          $(element)
            .find(".product-price")
            .text()
            .trim()
            .replace("€", "")
            .replace(",", ".")
        ),
        name: $(element).find(".versionpc a").attr("title"),
        photo: $(element).find(".product_img_link img").attr("data-original"),
        _id: uuidv5(link, uuidv5.URL),
      };
    })
    .get();
};

module.exports.scrape = async (url) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// p = this.scrape("https://adresse.paris/630-toute-la-collection").then(
//   (result) => {
//     console.log(result);
//   }
// );
// p;
