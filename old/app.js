const express = require('express')
const app = express()
const port = 3000
const path = require('path');


const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'WaveFinder';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Connected to MongoDB');

  const db = client.db(dbName);

  // Perform database operations here

  client.close();
});


function insert(){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("WaveFinder");
        var myobj = { name: "Subway", address: "Highway r47", entertainer: "Eddie Murphy", lat: "40.7505", lon:"73.9934" };
        dbo.collection("Places").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}

function findAllPlaces(){
    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("WaveFinder");
        const documents = await dbo.collection("Places").find({}).toArray();
        return documents.toString()
        //console.log(documents);
    });
}


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/login', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res) => {
    res.send('Hello World!')
})

app.post('/checkin', (req, res) => {
    res.send('Hello World!')
})

app.get('/places/All', async (req, res) => {
    //var info  = await findAllPlaces(); 

    MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      var dbo = db.db("WaveFinder");
      const documents = await dbo.collection("Places").find({}).toArray();
      //console.log(documents);
      res.send(documents)
    });
    //console.log(info);
    //res.send('Hello World!')
    //findAllPlaces();
   
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


