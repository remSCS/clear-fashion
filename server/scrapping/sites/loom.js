const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { v5: uuidv5 } = require("uuid");

const parse = (data) => {
  const $ = cheerio.load(data, { xmlMode: true });

  return $(".product-grid__item")
    .map((i, element) => {
      const link = `https://www.loom.fr${$(element)
        .find(".product-title a")
        .attr("href")}`;

      return {
        link,
        brand: "Loom",
        price: parseFloat($(element).find(".money").text()),
        name: $(element)
          .find(".product-title")
          .text()
          .trim()
          .replace(/\s/g, " "),
        photo: $(element).find("noscript img.product_card__image").attr("src"),
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
    return;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// p = this.scrape("https://www.loom.fr/collections/tous-les-vetements").then(
//   (result) => {
//     console.log(result);
//   }
// );
// p;
