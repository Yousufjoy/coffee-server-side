const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//MongoDb Initial Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9hatji.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Connect to the "coffeeDB" database and access its "coffee" collection

    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // 1) CREATE/POST
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee); // Mongo db te add korte chaile google e search node mongoDb crud then - usage examples-insert operations-inserta a document
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // 2) READ/GET all the data

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find(); // cursor mane ekta pointer set kortesi oi collection er moddhe
      const result = await cursor.toArray(); // joto gula item ase sob diye dibe
      res.send(result);
    });

    // 3) Delete

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // 4) Find specific product, here i am getting the speicifc product i want to update

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // 5) Update single coffee information

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }; // upsert mane hocche thakle tumi update korba na thakle notun ekta create korba
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          category: updatedCoffee.category,
          photo: updatedCoffee.photo,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee making server is runnig");
});

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});

// Nothing actually changed in this commit only the client side is changed i am committing to make both side equal
