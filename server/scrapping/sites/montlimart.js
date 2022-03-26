const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { v5: uuidv5 } = require("uuid");

const parse = (data) => {
  const $ = cheerio.load(data);
  return $(".category-products .item")
    .map((i, element) => {
      let url = $(element).find(".actions a").attr("href");
      if (url === undefined) return;
      return {
        brand: "Montlimart",
        name: $(element)
          .find(".product-info .product-name")
          .text()
          .trim()
          .replace(/\s+/g, " "),
        price: parseFloat(
          $(element)
            .find(".product-info .price")
            .text()
            .replace(",", ".")
            .replace("€", "")
            .trim()
        ),
        image: $(element).find(".product-image img").attr("src"),
        link: url,
        _id: uuidv5(url, uuidv5.URL),
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
    return;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// p = this.scrape("https://www.montlimart.com/toute-la-collection.html").then(
//   (result) => {
//     console.log(result);
//   }
// );
// p;
