// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = ""; // Feature 2
let RecentlyChecked = false; //Feature 3
let ReasonableChecked = false; //Feature 4
let kindOfSort = ""; //Feature 5
let favoriteProducts = [];
let FavoriteChecked = false; // Feature 14

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');


const selectBrand = document.querySelector('#brand-select'); // Feature 2
const selectRecentlyReleased = document.querySelector('#recently-released');//Feature 3
const selectReasonable = document.querySelector('#reasonable-price'); // Feature 4
const selectSort = document.querySelector('#sort-select'); // Feature 5 and 6
const spanNbProductsDisplayed = document.querySelector('#nbProductsDisplayed');// Feature 8
const spanNbNewProducts = document.querySelector('#nbNewProducts'); // Feature 9
const spanp50 = document.querySelector('#p50Value'); //Feature 10
const spanp90 = document.querySelector('#p90Value');
const spanp95 = document.querySelector('#p95Value');
const lastReleasedDate = document.querySelector('#last-released'); //Feature 11
const selectShowFavorite = document.querySelector('#show-favorite'); // Feature 14

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

const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-server-side.vercel.app/products/search?limit=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <div>
          <span>Brand 👚 : </span>
          <strong>${product.brand}</strong>
        </div>
        <div>
          <span>Link 📎 : </span>
          <a href="${product.link}" target="_blank">${product.name}</a>
        </div>
          <span>Price 💸 : </span>
          <strong>${product.price} €</strong>
        <div>
          <input type="checkbox" onclick="checkFavorite('${product.uuid}')" ${product.favorite ? "checked" : ""}>
          <label for="favorite-product">Add to favorite</label>
        </div>
      </div>
    `;
    })
    .join('');

  if(currentProducts.length != 0 ) div.innerHTML = template;
  else div.innerHTML = "0 product correspond to these filters on this page";

  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;

  // Feature 8 - Number of products indicator
  spanNbProductsDisplayed.innerHTML = currentProducts.length; 
  
  //Feature 9 - Number of recent products indicator
  spanNbNewProducts.innerHTML = currentProducts.filter(product => new_product(product)).length; 
  
  // Feature 10 - p50, p90 and p95 price value indicator
  if(currentProducts.length != 0){
  spanp50.innerHTML = calcQuartile(currentProducts,50).toFixed(2) + " €";
  spanp90.innerHTML = calcQuartile(currentProducts,90).toFixed(2) + " €";
  spanp95.innerHTML = calcQuartile(currentProducts,95).toFixed(2) + " €";
  lastReleasedDate.innerHTML = lastReleasedProduct(currentProducts).released; // Feature 11
  }
  else {
    spanp50.innerHTML = "No data";
    spanp90.innerHTML = "No data";
    spanp95.innerHTML = "No data";
    lastReleasedDate.innerHTML = "No data"; // Feature 11
  }

};

/**
 * Render brand selector
 * @param  {Object} products
 */
 const renderBrands = products => {
  const brands = []; // distinct list of brands 
  const options = products.map(product => {
    // if the brand doesn't exist in the list of brands
    if(!brands.includes(product.brand)){
      brands.push(product.brand);
      return `<option value="${product.brand}" ${currentBrand === product.brand ? "selected" : ""}>${product.brand}</option>`;
    }
  });

  options.unshift(`<option value="">All brands</option>`);

  selectBrand.innerHTML = options.join('');
  if(currentBrand === ""){
    selectBrand.selectedIndex = 0;
  }
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(products);
};

/**
 * Declaration of all Listeners
 */

// Feature 0 : Show more
selectShow.addEventListener('change', async (event) => {
  currentPagination.pageSize = parseInt(event.target.value);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
  .then(setCurrentProducts)
  // .then(() => {
  //   updateCurrentProductsWithFavorites() //Feature 14
  // })
  .then(() => { 
    //Feature 2
    if(currentBrand !== ""){
      currentProducts = currentProducts.filter(product => product.brand === currentBrand);
    }
    //Feature 3
    if(RecentlyChecked){
      currentProducts = currentProducts.filter(product => new_product(product))
    }
    //Feature 4
    if(ReasonableChecked){
      currentProducts = currentProducts.filter(product => reasonable_price(product));
    }
    //Feature 5 & 6
    if(kindOfSort !== "no-sort"){
      if(kindOfSort === "price-asc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price >  e2.price});
      else if(kindOfSort === "price-desc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price <  e2.price});
      else if(kindOfSort === "date-asc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()})
      else if(kindOfSort === "date-desc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()})
    }
    //Feature 14
    // if(FavoriteChecked){
    //   currentProducts = currentProducts.filter(product => isInFavorite(product));
    // }
    render(currentProducts, currentPagination);
  })
});

// Feature 1 : Browse pages
selectPage.addEventListener('change', async (event) => {
  currentPagination.currentPage = parseInt(event.target.value);
  fetchProducts( currentPagination.currentPage, currentPagination.pageSize)
  .then(setCurrentProducts)
  // .then(() => {
  //   updateCurrentProductsWithFavorites() //Feature 14
  // })
  .then(() => { 
    //Feature 2
    if(currentBrand !== ""){
      currentProducts = currentProducts.filter(product => product.brand === currentBrand);
    }
    //Feature 3
    if(RecentlyChecked){
      currentProducts = currentProducts.filter(product => new_product(product))
    }
    //Feature 4
    if(ReasonableChecked){
      currentProducts = currentProducts.filter(product => reasonable_price(product));
    }
    //Feature 5 & 6
    if(kindOfSort !== "no-sort"){
      if(kindOfSort === "price-asc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price >  e2.price});
      else if(kindOfSort === "price-desc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price <  e2.price});
      else if(kindOfSort === "date-asc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()})
      else if(kindOfSort === "date-desc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()})
    }
    //Feature 14
    // if(FavoriteChecked){
    //   currentProducts = currentProducts.filter(product => isInFavorite(product));
    // }
    render(currentProducts, currentPagination);
  })
});

// Feature 2 - Filter by brands
selectBrand.addEventListener('change', async (event) => {
  currentBrand = event.target.value;
  fetchProducts( currentPagination.currentPage, currentPagination.pageSize)
  .then(setCurrentProducts)
  // .then(() => {
  //   updateCurrentProductsWithFavorites() //Feature 14
  // })
  .then(() => { 
    if(currentBrand !== ""){
      //.filter(): Returns the elements of an array that meet the condition specified in a callback function.
      // example: words.filter(word => word.length > 6);
      currentProducts = currentProducts.filter(product => product.brand === currentBrand);
    }
    //Feature 3
    if(RecentlyChecked){
      currentProducts = currentProducts.filter(product => new_product(product))
    }
    //Feature 4
    if(ReasonableChecked){
      currentProducts = currentProducts.filter(product => reasonable_price(product));
    }
    //Feature 5 & 6
    if(kindOfSort !== "no-sort"){
      if(kindOfSort === "price-asc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price >  e2.price});
      else if(kindOfSort === "price-desc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price <  e2.price});
      else if(kindOfSort === "date-asc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()})
      else if(kindOfSort === "date-desc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()})
    }
    //Feature 14
    // if(FavoriteChecked){
    //   currentProducts = currentProducts.filter(product => isInFavorite(product));
    // }
      render(currentProducts, currentPagination);
  })
});

// Feature 3 - Filter by recent products
selectRecentlyReleased.addEventListener('change', event => {
  RecentlyChecked = selectRecentlyReleased.checked;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
  .then(setCurrentProducts)
  // .then(() => {
  //   updateCurrentProductsWithFavorites() //Feature 14
  // })
  .then(() => { 
    //Feature 2
    if(currentBrand !== ""){
      currentProducts = currentProducts.filter(product => product.brand === currentBrand);
    }
    //Feature 3
    if(RecentlyChecked){
      currentProducts = currentProducts.filter(product => new_product(product))
    }
    //Feature 4
    if(ReasonableChecked){
      currentProducts = currentProducts.filter(product => reasonable_price(product));
    }
    //Feature 5 & 6
    if(kindOfSort !== "no-sort"){
      if(kindOfSort === "price-asc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price >  e2.price});
      else if(kindOfSort === "price-desc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price <  e2.price});
      else if(kindOfSort === "date-asc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()})
      else if(kindOfSort === "date-desc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()})
    }
    // //Feature 14
    // if(FavoriteChecked){
    //   currentProducts = currentProducts.filter(product => isInFavorite(product));
    // }
    render(currentProducts, currentPagination);
    }) 
});

// Feature 4 - Filter by reasonable price
selectReasonable.addEventListener('change', event => {
  ReasonableChecked = selectReasonable.checked;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
  .then(setCurrentProducts)
  // .then(() => {
  //   updateCurrentProductsWithFavorites() //Feature 14
  // })
  .then(() => { 
    //Feature 2
    if(currentBrand !== ""){
      currentProducts = currentProducts.filter(product => product.brand === currentBrand);
    }
    //Feature 3
    if(RecentlyChecked){
      currentProducts = currentProducts.filter(product => new_product(product));
    }
    //Feature 4
    if(ReasonableChecked){
      currentProducts = currentProducts.filter(product => reasonable_price(product));
    }
    //Feature 5 & 6
    if(kindOfSort !== "no-sort"){
      if(kindOfSort === "price-asc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price >  e2.price});
      else if(kindOfSort === "price-desc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price <  e2.price});
      else if(kindOfSort === "date-asc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()})
      else if(kindOfSort === "date-desc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()})
    }
    // //Feature 14
    // if(FavoriteChecked){
    //   currentProducts = currentProducts.filter(product => isInFavorite(product));
    // }
    render(currentProducts, currentPagination);
  })
  
});

// Feature 5 a 6 - Sort by price & date
selectSort.addEventListener('change', event =>{
  kindOfSort = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
  .then(setCurrentProducts)
  // .then(() => {
  //   updateCurrentProductsWithFavorites() //Feature 14
  // })
  .then(() => { 
    if(currentBrand !== ""){
      currentProducts = currentProducts.filter(product => product.brand === currentBrand);
    }
    if(RecentlyChecked){
      currentProducts = currentProducts.filter(product => new_product(product))
    }
    if(ReasonableChecked){
      currentProducts = currentProducts.filter(product => reasonable_price(product));
    }
    if(kindOfSort !== "no-sort"){
      if(kindOfSort === "price-asc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price >  e2.price});
      else if(kindOfSort === "price-desc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price <  e2.price});
      else if(kindOfSort === "date-asc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()})
      else if(kindOfSort === "date-desc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()})
    }
    // //Feature 14
    // if(FavoriteChecked){
    //   currentProducts = currentProducts.filter(product => isInFavorite(product));
    // }    
      render(currentProducts, currentPagination);
  })
})


// Feature 13 - Save as favorite
// Feature 14 - Filter by favorite
// selectShowFavorite.addEventListener('change', event =>{
//   FavoriteChecked = selectShowFavorite.checked;
//   fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
//   .then(setCurrentProducts)
//   // .then(() => {
//   //   updateCurrentProductsWithFavorites()
//   // })
//   .then(() => { 
//     if(currentBrand !== ""){
//       currentProducts = currentProducts.filter(product => product.brand === currentBrand);
//     }
//     if(RecentlyChecked){
//       currentProducts = currentProducts.filter(product => new_product(product))
//     }
//     if(ReasonableChecked){
//       currentProducts = currentProducts.filter(product => reasonable_price(product));
//     }
//     if(kindOfSort !== "no-sort"){
//       if(kindOfSort === "price-asc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price >  e2.price});
//       else if(kindOfSort === "price-desc") currentProducts = currentProducts.sort( (e1, e2) => { return e1.price <  e2.price});
//       else if(kindOfSort === "date-asc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()})
//       else if(kindOfSort === "date-desc")  currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()})
//     }
//     // if(FavoriteChecked){
//     //   currentProducts = currentProducts.filter(product => isInFavorite(product));
//     // }
//       render(currentProducts, currentPagination);
//   })
// });


// Done at the end
document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);




// Methods

//From TD1
function new_product(product){
  let new_product = false;
  if ((new Date().getTime() - new Date(product.released).getTime() ) / (24*60*60*1000) < 14) { 
    new_product = true;
  }
  return new_product;
}

function reasonable_price(product){
  let reasonable = false;
  if(product.price < 50){
    reasonable = true;
  }
  return reasonable;
}

// Feature 10
function calcQuartile(products,q){
  var price_products = products.map(a => a.price);

  // Sort the array into ascending order
  var data = price_products.sort((e1, e2) => { return e1 >  e2});

  // Convert into decimal 
  q = q/100;

  // Work out the position in the array of the percentile point
  var p = ((data.length) - 1) * q;
  var b = Math.floor(p);

  // Work out what we rounded off (if anything)
  var remainder = p - b;

  // See whether that data exists directly
  if (data[b+1]!==undefined){
      return parseFloat(data[b]) + remainder * (parseFloat(data[b+1]) - parseFloat(data[b]));
  }else{
      return parseFloat(data[b]);
  }
}

//Feature 11
function lastReleasedProduct(products){
  products.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()});
  return products[0];
}

// Feature 13 (use in renderProducts)
function checkFavorite(product_id){
  const product = currentProducts.find(product => {
    return product.uuid === product_id;
  });  
  
  const index = currentProducts.indexOf(product);
  currentProducts[index].favorite = !product.favorite; //boleen 
  
  if(currentProducts[index].favorite){
    favoriteProducts.push(currentProducts[index]);
  }
  else{
    favoriteProducts = favoriteProducts.filter(product => product.uuid !== product_id);
  }
  render(currentProducts, currentPagination);
}

// // Feature 13 - 14
// function updateCurrentProductsWithFavorites(){
//   const listProducts = currentProducts.map(product => {
//     const found = favoriteProducts.find(favoriteProduct => favoriteProduct.uuid === product.uuid);
//     if(found) product.favorite = true;
//     return product;
//   });
//   currentProducts = listProducts;
// }

// Feature 14
// function isInFavorite(product){
//   var fav = false;
//   for(var favorite in favoriteProducts){
//     if(product.uuid === favoriteProducts[favorite].uuid) fav = true;
//   }
//   return fav;
// }