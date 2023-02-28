const fetch = require('node-fetch');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
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


async function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


module.exports.scrape = async function (url) {
  try {
    const browser = await puppeteer.launch();
    const BrowsingPage = await browser.newPage();
    await BrowsingPage.goto(url);
    var html = await BrowsingPage.content();
  
    var page = cheerio.load(html);
    var current_count = parseInt(page('.js-items-current').text());
    const total_count = parseInt(page('.js-allItems-total').text());
    console.log("total count: ", total_count);
    
    let previousHeight = 0;
    let currentHeight = await BrowsingPage.evaluate(() => document.body.scrollHeight);

    while (previousHeight < currentHeight || current_count < total_count) {
      console.log("current count: ", current_count);
      previousHeight = currentHeight;
      await BrowsingPage.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await BrowsingPage.waitForResponse(response => response.ok())
      

      html = await BrowsingPage.content();
      page = cheerio.load(html);
      
      current_count = parseInt(page('.js-items-current').text());

      currentHeight = await BrowsingPage.evaluate(() => document.body.scrollHeight);

      try {
      await BrowsingPage.click("#js-nextButton");
      }
      catch (error) 
      {
        continue;
      }
    }
    const result = await BrowsingPage.content();
    return parse(result);
  }
  catch (error) {
    console.error(error);
    return null;
  }
}

/*module.exports.clickNextButton = async function (url) {
  try {
    const browser = await puppeteer.launch();
    const BrowsingPage = await browser.newPage();
    await BrowsingPage.goto(url);
    var html = await BrowsingPage.content();

    var page = cheerio.load(html);
    var current_count = parseInt(page('.js-items-current').text());
    const total_count = parseInt(page('.js-allItems-total').text());
    console.log("current count: ", current_count);
    console.log("total count: ", total_count);
    var pos = 0;
    
    while (current_count < total_count) {
      console.log("current count: ", current_count);
      await BrowsingPage.evaluate(() => {
        pos = document.body.scrollHeight;
        window.scrollTo(0, pos);
        pos = pos + document.body.scrollHeight;
      });
      await sleep(1000);
      html = await BrowsingPage.content();
      page = cheerio.load(html);
      current_count = parseInt(page('.js-items-current').text());
    }
  
  }
  catch (error) {
    console.error(error);
    return null;
  }
}*/

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
