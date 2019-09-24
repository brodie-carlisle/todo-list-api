const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID; //converts ID from str to Mongo Atlas' format of "ObjectId", since that is the way Mongo Atlas stores the "_id"
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const db_url = process.env.DB_CONNECT;

const client = new MongoClient(db_url, {
  useNewUrlParser: true, //specifies that the new type of url string from mongo atlas is being used
  useUnifiedTopology: true
});

app.use(express.json()); //parses incoming JSON for the info the recipient is 'interested in' (JSON payloads); the other info is protocol overhead (status, etc.)
app.use(cors());

app.get("/", (req, res) => {
  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, dbinfo) => {
      if (err) console.log(err);
      const db = dbinfo.db("ToDo");
      db.collection("list")
        .find({})
        .toArray((err, item) => {
          //'item' = each entry in DB
          if (err) throw err;
          res.status(200).send(item);
        });
      client.close();
    }
  );
});

app.post("/", (req, res) => {
  const body = req.body;
  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, dbinfo) => {
      //callback function for DB connection. 1st arg is an error object, in case error occurs. 2nd param is the DB object (contains DB info)
      if (err) throw err;
      const db = dbinfo.db("ToDo"); //DB name
      db.collection("list").insertOne(body, (err, item) => {
        //inserts body rec'd from api into collection
        if (err) throw err;
        res.status(200).send(item);
      });
      client.close();
    }
  );
});

app.put("/:ID", (req, res) => {
  const body = req.body;

  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, dbinfo) => {
      if (err) throw err;
      const db = dbinfo.db("ToDo");
      db.collection("list").updateMany(
        { _id: ObjectId(req.params.ID) },
        { $set: body },
        (err, item) => {
          if (err) throw err;
          res.status(200).send(item);
        }
      );
      client.close();
    }
  );
});

app.delete("/:ID", (req, res) => {
  MongoClient.connect(
    db_url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    async (err, dbinfo) => {
      if (err) throw err;
      const db = dbinfo.db("ToDo");
      db.collection("list").deleteOne(
        {
          _id: ObjectId(req.params.ID)
        },
        (err, item) => {
          if (err) throw err;
          res.status(200).send(item); //Sets  the HTTP status for the response. Sends HTTP response
        }
      );
      client.close();
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
