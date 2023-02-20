/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswearbrand = require('./eshops/circlesportswearbrand');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news', brandName = "dedicated") {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
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
    }
    

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop, brandName] = process.argv;

sandbox(eshop, brandName);