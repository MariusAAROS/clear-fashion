const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs = require('fs');

function getClient() {
    const uri = "mongodb+srv://Marius_Ortega:VdDquPmKOLXTrY4T@clear-fashion.jdefltc.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    return client;
}

app.get('/products/search', async (request, response) => {
  try{
    const client = getClient();
    const collection = client.db("clear-fashion").collection("products");
    const brandName = request.query.brand;
	  const priceRoof = request.query.price;
	  var limPage = request.query.limit;

    var script = {};

    if (limPage == undefined) {
      limPage = 12;
    } else {
      limPage = parseInt(limPage);
    }
    if (brandName !== undefined) {
      script.brand = brandName;
    }
    if (priceRoof !== undefined) {
      script.price = {$lte: parseInt(priceRoof)};
    }
    const found = await collection.find(script).limit(limPage).toArray();
    response.send({result: found});

  } catch(err) {
    response.send({error : "Unreachable information"});  
  }
});

app.get('/brands', async (request, response) => {
  try{
    const client = getClient();
    const collection = client.db("clear-fashion").collection("products");
    const found = await collection.distinct('brand');
    response.send({result: found});
  }
  catch{
    response.send({error : "Couldn't fetch brands"}); 
  }
});

app.get('/products/:id', async (request, response) => {
  try{
    const productId = request.params.id;
    const script = {_id: ObjectId(productId)};
    const client = getClient();
    const collection = client.db("clear-fashion").collection("products");
    const found = await collection.find(script).toArray();
    
    response.send({result: found});

  } catch(err) {
	  response.send({error : "ID not found"});  
  }
});


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
