

// const fetchProducts = async (page = 1, size = 12) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8092/loadAllProductsWithPage?page=${page}&size=${size}`
//       );
//       const body = await response.json();
//       console.log("body",body);
  
//       if (response.status !== 200) {
//         console.error(response);
//         //return body;
//       }
  
//       return body;

//     } catch (error) {
//       console.error(error);
//     }
//   };



async function fetchProducts(page=1,size=12) {
    const url = `http://localhost:8092/loadAllProductsWithPage?page=${page}&size=${size}`
    const body = await (await fetch(url)).json()
    console.log("body",body)
    return body
  }
 

  export default fetchProducts;