/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswearbrand = require('./eshops/circlesportswearbrand');
const fs = require('fs');

async function sandbox (eshop = 'None', brandName = "all") {
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
      case 'all':
        const dedicatedUrl = "https://www.dedicatedbrand.com/en/men/news";
        const montlimartUrl = "https://www.montlimart.com/99-vetements";
        const circleUrl = "https://shop.circlesportswear.com/collections/collection-homme";
        const [dedicated, montlimart, circle] = await Promise.all([sandbox(dedicatedUrl, 'dedicated'), sandbox(montlimartUrl, 'montlimart'), sandbox(circleUrl, 'circle')])
        return [dedicated, montlimart, circle];
    }
    return products;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function ShowResult(result, allBrands) {
  if (allBrands == "false") {
    console.log(await result);
  }
  else {
    for (let i=0; i<result.length; i++) {
      console.log(await result[i]);
    }
  }
}

async function ToFile(result) {
  const toExport = JSON.stringify(await result);
  fs.writeFileSync('D:/COURS/A4/S8 - ESILV/Web Architecture Applications/TP1/clear-fashion/server/ScrappingResult.txt', toExport);
}

const [,, allShops, eshop, brandName] = process.argv;

if(allShops === "false") {
  const res = sandbox(eshop, brandName);
  ShowResult(res, allShops);
  ToFile(res);
}
else {
  const all = sandbox(eshop, brandName);
  ShowResult(all, allShops);
}
