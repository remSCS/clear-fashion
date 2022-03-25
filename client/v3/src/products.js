

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



async function fetchProducts(page=1,size=12) {
    const url = `http://localhost:8092/loadAllProductsWithPage?page=${page}&size=${size}`
    const body = await (await fetch(url)).json()
    return body
  }
 

  export default fetchProducts;