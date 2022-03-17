const service = require("./service.js");


test('Get all products returns a list of length 111', async () => {
    await expect(service.getAllProducts()).resolves.toHaveLength(111);
});

test('Find by existing product id returns one single object', async () => {
    let id_to_search_for = "b410f022-0599-5d8f-acfc-9bcaca7494d4";
    await expect(service.findByProductId({params:{id:id_to_search_for}})).resolves.toHaveLength(1);
});

test('Find by non existing product id returns error', async () => {
    let id_to_search_for = 123;
    await expect(() => service.findByProductId({params:{id:id_to_search_for}})).rejects.toThrow();
});