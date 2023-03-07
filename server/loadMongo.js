/*
async function getDB(MONGODB_URI, MONGODB_DB_NAME) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    return db;
}

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://Marius_Ortega:VdDquPmKOLXTrY4T@clear-fashion?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clear-fashion';

const db = getDB(MONGODB_URI, MONGODB_DB_NAME);
*/

const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

function importData() {
    const filePaths = [
        "D:/COURS/A4/S8 - ESILV/Web Architecture Applications/TP1/clear-fashion/server/exports/circle.json",
        "D:/COURS/A4/S8 - ESILV/Web Architecture Applications/TP1/clear-fashion/server/exports/dedicated.json",
        "D:/COURS/A4/S8 - ESILV/Web Architecture Applications/TP1/clear-fashion/server/exports/montlimart.json"
    ];
    const brands = [
        "circle",
        "dedicated",
        "montlimart"
    ];
    var products = [];
    filePaths.forEach(function (element, index) {
        const current = JSON.parse(fs.readFileSync(element));
        for (const item in current) {
            current[`${item}`].brand = brands[index];
        }
        products = Object.assign(products, current);
    });
    return products;
}

const products = importData();
console.log(products);
console.log("Total items: \n", products.length);


const uri = "mongodb+srv://Marius_Ortega:VdDquPmKOLXTrY4T@clear-fashion.jdefltc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async () => {
    const collection = client.db("clear-fashion").collection("products");
    const result = await collection.insertMany(products);
    console.log(result);
  client.close();
});