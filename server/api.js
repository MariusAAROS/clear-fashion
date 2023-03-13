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

const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

function getClient() {
    const uri = "mongodb+srv://Marius_Ortega:VdDquPmKOLXTrY4T@clear-fashion.jdefltc.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    return client;
}

function Query(filter = {}, options = {}){
  const client = getClient();
  client.connect(async () => {
      const collection = client.db("clear-fashion").collection("products");
      const result = await collection.find(filter, options).toArray();
      console.log(result);
      console.log("#Items: ", result.length);
  client.close();
  return result;
});
}

// 
app.get('/products/:id', async (request, response) => {
  try{
    const productId = request.params.id;
    const script = {_id: ObjectId(productId)};
	  console.log(JSON.stringify(script));
    const searchResult = Query(script);
    
	  response.send({result : searchResult});
    console.log(result);

  } catch(err) {
	  response.send({error : "ID not found"});  
  }
});


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
