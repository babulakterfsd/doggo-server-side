const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooo4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
     await client.connect();
     const database = client.db("dogfood");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const userCollection = database.collection("users");


    console.log('connected to Doggo database');
  }
  finally{
    //   await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req,res) => {
    res.send('Running Doggo Server..')
})

app.listen(port, () => {
    console.log('Listening to Doggo server on', port);
})