

const fetchProducts = async (page = 1, size = 12) => {
    try {
      const response = await fetch(
        `http://localhost:8092/loadAllProductsWithPage?page=${page}&size=${size}`
      );
      const body = await response.json();
  
      if (response.status !== 200) {
        console.error(response);
        return {result: body, meta: page};
      }
  
      return {result: body, meta: page};
    } catch (error) {
      console.error(error);
      return {result: body, meta: page};
    }
  };

  export default fetchProducts;