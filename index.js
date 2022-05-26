const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// var nodemailer = require('nodemailer');
// var sgTransport = require('nodemailer-sendgrid-transport');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rv98vtg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}





async function run() {
    try{
      await client.connect();
      const productData = client.db('troyalelectro').collection('products');
      const reviewData = client.db('troyalelectro').collection('review');
      console.log('db connected');
      //product display
      app.get('/products', async(req, res) =>{
        const query = {};
        const cursor = productData.find(query);
        const product = await cursor.toArray();
        res.send(product);
    });
      app.get('/review', async(req, res) =>{
        const query = {};
        const cursor = reviewData.find(query);
        const review = await cursor.toArray();
        res.send(review);
    });
    

    app.post('/products',  async (req, res) => {
      const Productdata = req.body;
      const result = await productData.insertOne(Productdata);
      res.send(result);
    });
    app.post('/review',  async (req, res) => {
      const reviewtdata = req.body;
      const result = await reviewData.insertOne(reviewtdata);
      res.send(result);
    });
    
      
    }
    finally{

    }
    
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send(`<h1 style="text-align: center;
      color: red;"> Server is Running at <span style="color: Blue;">${port}</span></h1>`);
  });

app.listen(port, () => {
  console.log("uniMart server Running at Port : ", port);
});
