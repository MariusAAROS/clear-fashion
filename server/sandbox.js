/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswearbrand = require('./eshops/circlesportswearbrand');
const fs = require('fs');

async function sandbox (eshop = 'None', brandName = "all") {
  try {
    console.log(`🕵️‍♀️ browsing ${eshop} eshop`);
    var products;

    switch (brandName) {
      case 'dedicated':
        products = await dedicatedbrand.scrape(eshop);
        break;
      case 'montlimart':
        products = await montlimartbrand.scrape(eshop);
        break;
      case 'circle':
        products = await circlesportswearbrand.scrape(eshop);
        break;
      case 'all':
        const dedicatedUrl = "https://www.dedicatedbrand.com/en/men/news";
        const montlimartUrl = "https://www.montlimart.com/99-vetements";
        const circleUrl = "https://shop.circlesportswear.com/collections/collection-homme";
        const [dedicated, montlimart, circle] = Promise.all([ await sandbox(dedicatedUrl, 'dedicated'), 
                                                              await sandbox(montlimartUrl, 'montlimart'),
                                                              await sandbox(circleUrl, 'circle')]).then((values)=> {
                                                                return values;
                                                                   });
        return [dedicated, montlimart, circle];
    }
    return products;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

async function scrapeBrand(eshop, brandName) {
  console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
  var products;

    switch (brandName) {
      case 'dedicated':
        //await dedicatedbrand.clickNextButton(eshop);
        products = await dedicatedbrand.scrape(eshop);
        break;
      case 'montlimart':
        products = await montlimartbrand.scrape(eshop);
        break;
      case 'circle':
        products = await circlesportswearbrand.scrape(eshop);
        break;
}
  return products;
}

async function scrapeAllBrands(eshops, brandNames) {
  console.log('🕵️‍♀️ browsing all eshops');
  var products = [];
  for (let i = 0; i < eshops.length; i++) {
    let temp = scrapeBrand(eshops[i], brandNames[i]);
    await ShowResult(temp, allShops);
    ToFile(temp, brandNames[i]);
  }
  return products
}

async function ShowResult(result, allBrands) {
  if (allBrands === "false") {
    console.log(await result);
    console.log("Scrapped Items: ", Object.keys(await result).length);
  }
  else {
    for (let i=0; i<result.length; i++) {
      console.log(await result[i]);
    }
  }
}

async function CountScrapedItems(result) {
  return result.length
}

async function ToFile(result, filename = "output") {
  const toExport = JSON.stringify(await result)
  fs.writeFileSync(`D:/COURS/A4/S8/Web Architecture Applications/clear-fashion/server/exports/${filename}.json`, toExport);
}

async function scrapeEngine() {
  const allShops = ["https://www.dedicatedbrand.com/en/men/news",
                    "https://www.montlimart.com/99-vetements",
                    "https://shop.circlesportswear.com/collections/collection-homme"];
  const allNames = ["dedicated",
                    "montlimart",
                    "circle"];
  const all = await scrapeAllBrands(allShops, allNames);
  //await ShowResult(all, allShops);
  //await ToFile(all, allNames);
}

const [,, allShops, eshop, brandName] = process.argv;

if(allShops === "false") {
  const res = scrapeBrand(eshop, brandName);
  ShowResult(res, allShops);
  ToFile(res, brandName);
}
else {
  scrapeEngine();
}
