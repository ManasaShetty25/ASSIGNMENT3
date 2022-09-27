const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const app = express();
const url = require('./secret.js');
const { ObjectId } = require("mongodb");

app.use(bodyParser.json());

const client = new MongoClient(url, {
    useNewUrlParser : true,
    useunifiedTopology : true
})

client.connect(err =>{
    const myDB = client.db('manasa').collection('friends');
    // console.log('ready');
    // const myObj ={name: "Manasa Shetty"};
    // coll.insertOne(myObj,(err,res)=>{
    //     console.log('inserted');
    //     client.close();
    // });
   


MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    console.log('connected');
    db.close();

})


app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');

})

app.get("/user/:name", (req, res) => {
    console.log(req.params);
    myDB
      .find(req.params)
      .toArray()
      .then((results) => {
        console.log(results);
        res.contentType("application/json"); //forcing application type to be json
        res.send(JSON.stringify(results));
      });
  });

  app
    .route("/users")
    .get((req, res) => {
      myDB
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.contentType("application/json"); //forcing application type to be json
          res.send(JSON.stringify(results));
        });
    })
    .post((req, res) => {
      console.log(req.body);
      myDB.insertOne(req.body).then((results) => {
        console.log(req.body);
        res.contentType("application/json"); //forcing application type to be json
        res.send(JSON.stringify(req.body));
      });
    })
    .put((req, res) => {
      console.log(req.body);
      myDB
        .findOneAndUpdate(
          { _id: ObjectId(req.body._id) },
          {
            $set: {
              name: req.body.name,
            },
          },
          {
            upsert: false,
          }
        )
        .then((result) => {
          res.contentType("application/json"); //forcing application type to be json
          res.send({ status: true });
        });
    })
    .delete((req, res) => {
      console.log(req.body);
      myDB
        .deleteOne({
          _id: ObjectId(req.body._id),
        })
        .then((result) => {
          let boo = true;
          if (res.deleteCount === 0) {
            boo: false;
          }
          res.send({ status: boo });
        })
        .catch((err) => console.log(err));
    });




app.listen(3000,()=>{
    console.log('server ready');
})
})