const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

function getClient() {
    const uri = "mongodb+srv://Marius_Ortega:VdDquPmKOLXTrY4T@clear-fashion.jdefltc.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    return client;
}
/*
function FindAllBrandProduct(brandName = "dedicated") {
    const client = getClient();
    client.connect(async () => {
        const collection = client.db("clear-fashion").collection("products");
        console.log()
        const result = await collection.find({brand: `${brandName}`}).toArray();
        console.log(result);
        console.log("#Items: ", result.length);
    client.close();
    return result;
});
}

function FindAllItemsLowerThanPrice(price){
    const client = getClient();
    client.connect(async () => {
        const collection = client.db("clear-fashion").collection("products");
        console.log()
        const result = await collection.find({price:{$lt:price}}).toArray();
        console.log(result);
        console.log("#Items: ", result.length);
    client.close();
    return result;
});
}
*/

function FindAllBrandProduct(brandName = "dedicated") {
    const script = {brand: `${brandName}`};
    Query(script);
}

function FindAllItemsLowerThanPrice(price = 50) {
    const script = {price:{$lt:price}};
    Query(script);
}


function Query(script){
    const client = getClient();
    client.connect(async () => {
        const collection = client.db("clear-fashion").collection("products");
        console.log()
        const result = await collection.find(script).toArray();
        console.log(result);
        console.log("#Items: ", result.length);
    client.close();
    return result;
});
}

//FindAllBrandProduct("montlimart");
FindAllItemsLowerThanPrice(50);
