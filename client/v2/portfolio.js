// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api endpoints :
  Search for specific products :
  GET https://clear-fashion-fc1dn05tf-mariusaaros.vercel.app/procucts/:id
  Search with filter : 
  GET https://clear-fashion-fc1dn05tf-mariusaaros.vercel.app/products/search?brand=dedicated&limit=10&price=50
  This endpoint accepts the following optional query string parameters:
  - `brand` - choose a brand
  - `limit` - number of products to return
  - `price`
  Search for available brands list :
  GET https://clear-fashion-fc1dn05tf-mariusaaros.vercel.app/brands
*/

// current products on the page
let currentProducts = [];
let currentPagination = {pageSize: 12};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const selectFilterReasonablePrice = document.querySelector('#filterRPrice-select');
const selectFilterRecentlyReleased = document.querySelector('#filterRReleased-select');

const spanNbBrands = document.querySelector('#nbBrands');

var favorites = [];
const fetchedFav = JSON.parse(localStorage.getItem("favorites"));
if(fetchedFav !== undefined && fetchedFav !== "" && fetchedFav != null) {
  favorites = fetchedFav;
}
var favoritesCheckBoxes = document.querySelectorAll('.star'); 

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */

const fetchProducts = async (brand = "", price = "", limit = 12) => {
  try {
    var queryExtension = "";
    //console.log("test".concat(" lol"));

    if(brand !== "") {
      queryExtension = queryExtension.concat(`?brand=${brand}`);
    }
    if(price !== "") {
      if(queryExtension === "") {
        queryExtension = queryExtension.concat("?");
      }
      else {
        queryExtension = queryExtension.concat("&");
      }
      queryExtension = queryExtension.concat(`price=${price.toString()}`);
    }
    if(queryExtension === "") {
      queryExtension = queryExtension.concat("?");
    }
    else {
      queryExtension = queryExtension.concat("&");
    }
    queryExtension = queryExtension.concat(`limit=${limit.toString()}`);
    const response = await fetch(
      "http://localhost:8092/products/search".concat(queryExtension)
    );

    const body = await response.json();
    if (body === undefined) {
      return {currentProducts, currentPagination};
    }

    return body;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


async function fetchBrands() {
  try {
    const response = await fetch(
      'http://localhost:8092/brands'
    );
    const body = await response.json();

    if (body === undefined) {
      console.error(error);
    }
    else {
      
      var brands = body.result;
      
      const nbBrands = brands.length;
      brands.splice(0, 0, "None");
      return brands;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  var counter = -1;
  //var checkMarker = "checked";
  const template = products
    .map(product => {
      counter++;
      var checkMarker;
      if(favorites.includes(`${product._id}`)) {
        checkMarker = "";
      }
      else {
        checkMarker = "checked";
      }
      

      return `
      <div class="product" id=${product._id}>
        <div class="product-container">
          <img src="${product.image}" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/3/3c/Clothes_hanger_icon_3.svg'" vspace="15">
          <div>
            <span>${product.brand}</span>
            <a href="${product.link}" target="_blank">${product.name}</a>
            <span>${product.price}</span>
            <input id="${product._id}" class="star" type="checkbox" title="bookmark page" ${checkMarker}>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selectors
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount, pageSize} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Find the qth quantile of a sorted array
 * @param {Array} sorted
 * @param {Float} q
 * @param {String} attribute
 * @returns
 */
const quantile = (sorted, q, attribute) => {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1][attribute] !== undefined) {
      return sorted[base][attribute] + rest * (sorted[base + 1][attribute] - sorted[base][attribute]);
  } else {
      return sorted[base][attribute];
  }
};

/**
 * Finds last released product
 */
function lastReleaseDate(allProducts){
  allProducts = sortByDate(allProducts);
  return allProducts[0].scrapDate;
};

/**
 * Finds the number of new products
 */

function nbNewProducts(allProducts, currentPagination) {
  const countNewProds = allProducts.result.filter(checkDate).length;
  return countNewProds;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  //spanNbProducts.innerHTML = count;
};

/**
 * Render Brands selection
 */

/*const renderBrands = products => {
  var brandNames = products.map(function(A) {return A["brand"]});
  brandNames = Array.from([...new Set(brandNames)]);
  brandNames.splice(0, 0, "None");
  //const lengthProducts = products.length;
  const options = Array.from(
    brandNames,
    (value) => `<option value="${value}">${value}</option>`
  ).join('');
  selectBrand.innerHTML = options;
};*/
const renderBrands = brands => {
  const options = Array.from(
    brands,
    (value) => `<option value="${value}">${value}</option>`
  ).join('');
  document.getElementById('nbBrands').innerHTML = brands.length-1;
  selectBrand.innerHTML = options;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  setupCheckBoxListeners(favoritesCheckBoxes, favorites);
};

/**
 * Filters products by reasonable price
 * @param {Array} data 
 * @returns 
 */
function checkPrice(data){
  return data.price <= 50;
}

/**
 * Calculates the difference between two dates
 * @param {String} date1 
 * @param {String} date2 
 * @returns 
 */
function dateDiff(date1, date2) {
  var diff = {}
  var tmp = new Date(date2) - new Date(date1);

  tmp = Math.floor(tmp/1000);
  diff.sec = tmp % 60;

  tmp = Math.floor((tmp-diff.sec)/60);
  diff.min = tmp % 60;

  tmp = Math.floor((tmp-diff.min)/60);
  diff.hour = tmp % 24;

  tmp = Math.floor((tmp-diff.hour)/24);
  diff.day = tmp;

  return diff;
}

/**
 * Filters products by recent release
 * @param {Array} date 
 */
function checkDate(data){
  var curDate = new Date();
  curDate.getTime();
  var nDays = dateDiff(data.scrapDate, curDate);
  return nDays.day <= 30;
}

/**
 * Sorts products by date
 * @param {Array} data 
 * @returns 
 */
function sortByDate(data) {
  data.sort((a, b) => {
    const dateA = new Date(a.scrapDate);
    const dateB = new Date(b.scrapDate);
    return dateB - dateA;
  });
  return data;
}

/**
 * Sorts products by price
 * @param {Array} data 
 * @returns 
 */
function sortByPrice(data) {
  data.sort((a, b) => b.price - a.price);
  return data.reverse();
}

/**
 * Favorites features
 */

/**
 * Create the favorites list
 * @param {Object} pagination 
 */
function createFavoriteList(pagination) {
  //var favorites = [...Array(pagination.count).keys()];
  var favorites = [];
  if (localStorage.favorites === undefined){
    localStorage.setItem('favorites', favorites);
  }
};

/**
 * Adds an element to favorites list
 * @param {Object} element 
 */
function addToFavorite(favorites, element) {
  favorites.push(element);
}

/**
 * Removes an element from favorites list
 * @param {Object} element 
 */
function removeFavorite(favorites, element) {
  let i = 0;
  while (i < favorites.length) {
    if (favorites[i] === element) {
      favorites.splice(i, 1);
    } 
    else {
      ++i;
    }
  }
}

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  var products = await fetchProducts("", "", parseInt(event.target.value));
  console.log(products.meta);
  products.result = products.result.slice(0, parseInt(event.target.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  var products = await fetchProducts("", "");
  products.result = products.result.slice(currentPagination.pageSize*(parseInt(event.target.value)-1), currentPagination.pageSize*parseInt(event.target.value));
  products.meta.currentPage = parseInt(event.target.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  var products = await fetchProducts("", "");
  products.result = products.result.slice(0, 12);
  setCurrentProducts(products);
  const brands = await fetchBrands();
  renderBrands(brands);
  
  const allProducts = await fetchProducts("","", 10000);

  spanNbProducts.innerHTML = allProducts.result.length;

  const nbNewProds = nbNewProducts(allProducts);
  document.getElementById('nbNewProducts').innerHTML = nbNewProds;

  const p50 = quantile(sortByPrice(allProducts.result), 0.5, "price");
  const p90 = quantile(sortByPrice(allProducts.result), 0.9, "price");
  const p95 = quantile(sortByPrice(allProducts.result), 0.95, "price");

  document.getElementById('p50').innerHTML = Math.round(p50*100)/100;
  document.getElementById('p90').innerHTML = Math.round(p90*100)/100;
  document.getElementById('p95').innerHTML = Math.round(p95*100)/100;

  document.getElementById('lastRDate').innerHTML = lastReleaseDate(allProducts.result);

  render(currentProducts, currentPagination);

  favoritesCheckBoxes = document.querySelectorAll('.star');
  setupCheckBoxListeners(favoritesCheckBoxes, favorites);
  //createFavoriteList(currentPagination);
});

/**
 * Event listener for brands filtering
 */
selectBrand.addEventListener('change', async (event) => {
  let filteredProducts = [];
  const selectedBrand = event.target.value;
  const oldSize = currentPagination.pageSize;
  const oldCurrentPage = currentPagination.currentPage;
  if (selectedBrand !== "None") {
    //filteredProducts = currentProducts.filter(product => product.brand === selectedBrand);
    filteredProducts = await fetchProducts(selectedBrand, "", currentPagination.pageSize);
  } else {
    filteredProducts = await fetchProducts("", "", currentPagination.pageSize);
  }
  filteredProducts.result = filteredProducts.result.slice(oldSize*(parseInt(oldCurrentPage)-1), oldSize*parseInt(oldCurrentPage));
  currentPagination.brand = selectedBrand;
  currentPagination.pageSize = oldSize;
  renderProducts(filteredProducts.result);
  setupCheckBoxListeners(favoritesCheckBoxes, favorites);
});
/*
selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(1, currentPagination.pageCount);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
*/

/**
 * Event listener for filtering by reasonable price
 */
selectFilterReasonablePrice.addEventListener('click', () => {
  let filteredProducts = [];
  filteredProducts = currentProducts.filter(checkPrice);
  //setCurrentProducts(currentProducts, currentPagination);
  renderProducts(filteredProducts);
  setupCheckBoxListeners(favoritesCheckBoxes, favorites);
});

/**
 * Event listener for filtering by recently released
 */
selectFilterRecentlyReleased.addEventListener('click', () => {
  let filteredProducts = [];
  filteredProducts = currentProducts.filter(checkDate);
  //setCurrentProducts(currentProducts, currentPagination);
  renderProducts(filteredProducts);
  setupCheckBoxListeners(favoritesCheckBoxes, favorites);
})

/**
 * Event listener for sorting
 */
selectSort.addEventListener('change', (event) => {
  var sortedProducts;
  if (event.target.value === 'date-desc'){
    sortedProducts = sortByDate(currentProducts).reverse();
  }
  else if (event.target.value === 'date-asc'){
    sortedProducts = sortByDate(currentProducts);
  }
  else if (event.target.value === 'price-asc'){
    sortedProducts = sortByPrice(currentProducts);
  }
  else if (event.target.value === 'price-desc'){
    sortedProducts = sortByPrice(currentProducts).reverse();
  }
  //setCurrentProducts(currentProducts, currentPagination);
  renderProducts(sortedProducts);
});

/**
 * Event listener for favorites selection
 */
function setupCheckBoxListeners(favoritesCheckBoxes, favorites) {
  favoritesCheckBoxes.forEach(checkbox => {
    checkbox.addEventListener('change', event => {
      const element = event.target.id;
      if (!event.target.checked) {
        console.log(favorites);
        addToFavorite(favorites, element);
      }
      else {
        removeFavorite(favorites, element);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    });
  });
};