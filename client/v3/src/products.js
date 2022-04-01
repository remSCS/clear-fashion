

// const fetchProducts = async (page = 1, size = 12) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8092/loadAllProductsWithPage?page=${page}&size=${size}`
//       );
//       const body = await response.json();
  
//       if (response.status !== 200) {
//         console.error(response);
//         return {currentProducts, currentPagination};
//       }
  
//       return {result: body, meta: page};
//     } catch (error) {
//       console.error(error);
//       return {currentProducts, currentPagination};
//     }
//   };



async function fetchProducts(page=1,size=12,brand="",price=0) {
    let url = "";
    if(price!==0 && (price===1 || price===-1)){
        url = `http://localhost:8092/loadClientProducts_filtered?${page ? `&page=${page}` : ""}&size=${size}&brand=${brand}&price=${price}`;
    }
    else{// aucun tri par prix
        url= `http://localhost:8092/loadClientProducts?page=${page}&size=${size}&brand=${brand}`;
    }
    
    const body = await (await fetch(url)).json();
    return body;
  }
 

  export default fetchProducts;