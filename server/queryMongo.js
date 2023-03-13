const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

function Query(filter = {}, options = {}){
    const client = getClient();
    client.connect(async () => {
        const collection = client.db("clear-fashion").collection("products");
        console.log()
        const result = await collection.find(filter, options).toArray();
        console.log(result);
        console.log("#Items: ", result.length);
    client.close();
    return result;
});
}

function FindAllBrandProduct(brandName = "dedicated") {
    const script = {brand: `${brandName}`};
    return Query(script);
}

function FindAllItemsLowerThanPrice(price = 50) {
    const script = {price:{$lt:price}};
    return Query(script);
}

function SortItemsByPrice(order= "desc") {
    var script;
    if(order === "desc") {
        script = {sort: {price:-1}};
    }
    else {
        script = {sort: {price:1}};
    }
    return Query({}, script);
}

function SortItemsByDate(order= "desc") {
    var script;
    if(order === "desc") {
        script = {sort: {scrapDate:-1}};
    }
    else {
        script = {sort: {scrapDate:1}};
    }
    return Query({}, script);
}

function FindRecentProducts() {
    let twoWeeksAgo = new Date(Date.now()-14*24*60*60*1000);
    const script = {scrapDate: {$gte: twoWeeksAgo}};
    return Query({}, script);
}

FindAllBrandProduct("montlimart");
//FindAllItemsLowerThanPrice(50);
//SortItemsByPrice();
//SortItemsByDate();
//FindRecentProducts();
//Query({_id: ObjectId('640da549c7f8bd7e0d5dafa8')});