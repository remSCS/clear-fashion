require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs");

const MONGODB_DB_NAME = "Cluster0";
const MONGODB_COLLECTION = "products";
const MONGODB_URI = process.env.MONGODB_URI;

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = (module.exports.getDB = async () => {
  try {
    if (database) {
      console.log("💽  Already Connected");
      return database;
    }

    console.log("Mongo URI:", MONGODB_URI);
    client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    database = client.db(MONGODB_DB_NAME);
    console.log("💽  Connected");

    return database;
  } catch (error) {
    console.error("🚨 MongoClient.connect...", error);
    return null;
  }
});

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async (products) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    return await collection.insertMany(
      products.filter((p) => {
        return p != null;
      }),
      {
        ordered: false,
      }
    );
  } catch (error) {
    error.result;
    console.error("🚨 collection.insertMany...", error);
    fs.writeFileSync("products.json", JSON.stringify(products));
    return {
      insertedCount: error.result.nInserted,
    };
  }
};

/**
 * Find products based on query
 * @param  {{_id}}  query
 * @return {Array}
 */
module.exports.find = async (query) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    return await collection.find(query).toArray();
  } catch (error) {
    console.error("🚨 collection.find...", error);
    return null;
  }
};

module.exports.loadAllClientProducts=async()=>{
  try{
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    return await collection.find().toArray();
  }
  catch(e){
    console.error("error in loading all products : ",e)
  }
}

module.exports.loadClientProducts_filtered = async (
  query,
  sorters,
  limit = 0,
  page = 1
) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    return await collection
      .find(query)
      .skip((page - 1) * limit)
      .sort(sorters)
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error("🚨 collection.find...", error);
    return null;
  }
};

module.exports.loadClientProducts = async (query, limit = 0, page = 1) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    console.log("here");
    console.log(limit, page, query);
    return await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error("🚨 collection.find...", error);
    return null;
  }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error("🚨 MongoClient.close...", error);
  }
};
