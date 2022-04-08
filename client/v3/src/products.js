async function fetchProducts(page=1,productsPerPage=12,brand="",price=0) {
    let url = `https://clear-fashion-server-side.vercel.app//loadClientProducts?currentPage=${page}&productsPerPage=${productsPerPage}&brand=${brand}&price=${price}`;
    
    let {products,meta} = await (await fetch(url)).json();
    return {products,meta};
  }
 

  export default fetchProducts;
