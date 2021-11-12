const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooo4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("dogfood");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const userCollection = database.collection("users");

    //post all users data to users collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

     // google user and upsert user 
     app.put("/users", async (req, res) => {
      const user = req.body;
      console.log(user)
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateUser = { $set: user };
      const result = await userCollection.updateOne(
          filter,
          updateUser,
          options
      );
      res.json(result);
  });


    //get all product
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //get a single product
    app.get("/products/:productid", async (req, res) => {
      const productid = req.params.productid;
      const query = { _id: ObjectId(productid) };
      const product = await productCollection.findOne(query);
      console.log("load user with id", product);
      res.send(product);
    });

    //Confirm order
    app.post("/placeorder", async (req, res) => {
      const orderProduct = req.body;
      const result = await orderCollection.insertOne(orderProduct);
      console.log("order placed", req.body);
      console.log("successfully ordered", result);
      res.json(result);
    });

    //get all review
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //add user review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log("review added", req.body);
      console.log("successfully added review", result);
      res.json(result);
    });

    //get all order
    app.get("/allorder", async (req, res) => {
      const cursor = orderCollection.find({});
      const services = await cursor.toArray();
      res.json(services);
    });

    // get my orders
    app.get("/myorders/:email", async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // delete a single order
    app.delete("/allorder/:id", async (req, res) => {
      const id = req.params.id;
      console.log("deleted id ", id);
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    // delete a single product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("deleted id ", id);
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    });

    // add a product
    app.post("/addproduct", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log("got new product", req.body);
      console.log("successfully added product", result);
      res.json(result);
    });

    //update order status
    app.put("/allorder/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.body);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const productUpdate = {
        $set: {
          status: "shipped",
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        productUpdate,
        options
      );
      res.json(result);
    });

    console.log("connected to Doggo database");
  } finally {
    //   await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Doggo Server..");
});

app.listen(port, () => {
  console.log("Listening to Doggo server on", port);
});
