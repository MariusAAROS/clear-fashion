const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

function importData() {
    
    const filePaths = [
        "D:/COURS/A4/S8 - ESILV/Web Architecture Applications/TP1/clear-fashion/server/exports/dedicated.json",
        "D:/COURS/A4/S8 - ESILV/Web Architecture Applications/TP1/clear-fashion/server/exports/montlimart.json",
        "D:/COURS/A4/S8 - ESILV/Web Architecture Applications/TP1/clear-fashion/server/exports/circle.json"
    ];

    var products = [];
    filePaths.forEach(function (element) {
        const current = JSON.parse(fs.readFileSync(element));
        console.log(element);
        /*for (const item in current) {
            current[`${item}`].brand = brands[index];
        }*/
        products = products.concat(current);
    });
    return products;
}

const products = importData();

console.log("Total items: \n", products.length);


const uri = "mongodb+srv://Marius_Ortega:eM8X91KacgKMOLJ6@cluster-clear-fashion.osvfb5i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async () => {
    const collection = client.db("clear-fashion-2").collection("products");
    const result = await collection.insertMany(products);
    console.log(result);
  client.close();
});