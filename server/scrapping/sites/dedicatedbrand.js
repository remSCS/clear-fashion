const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { v5: uuidv5 } = require("uuid");

const parse = (data) => {
  const $ = cheerio.load(data);

  return $(".productList-container .productList")
    .map((i, element) => {
      const link = `https://www.dedicatedbrand.com${$(element)
        .find(".productList-link")
        .attr("href")}`;

      return {
        link,
        brand: "Dedicated",
        price: parseFloat(
          $(element).find(".productList-price").text().trim().replace("EUR", "")
        ),
        name: $(element)
          .find(".productList-title")
          .text()
          .trim()
          .replace(/\s/g, " "),
        photo: $(element)
          .find(".productList-link .productList-image img")
          .attr("data-src"),
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
//
// p = this.scrape("https://adresse.paris/630-toute-la-collection").then(
//   (result) => {
//     console.log(result);
//   }
// );
// p;
