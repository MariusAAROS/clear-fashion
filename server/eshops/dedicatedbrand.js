const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { response } = require('express');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      return {name, price};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
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

async function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

module.exports.clickNextButton = async function (url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.text();
      const page = cheerio.load(body);
      var current_count = parseInt(page('.js-items-current').text());
      const total_count = parseInt(page('.js-allItems-total').text());
      console.log("current count: ", current_count);
      console.log("total count: ", total_count);
      while (current_count < total_count) {
        console.log("current count: ", current_count);
        //window.scrollTo(0, document.body.scrollHeight);
        await sleep(1000);
        current_count = parseInt(page('.js-items-current').text());
      }
    }  
  }
  catch (error) {
    console.error(error);
    return null;
  }
}

/*
module.exports.clickNextButton = async function (url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.text();
      const page = cheerio.load(body);
      const current_count = page('.js-items-current');
      const total_count = page('.js-allItems-total');

      while (current_count < total_count) {
        const button = page("#js-nextButton");
        button.click();
        await sleep(1000);
        current_count = page('.js-items-current');
      }
    }  
  }
  catch (error) {
    console.error(error);
    return null;
  }
}
*/

