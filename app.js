const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const app = express();
const port = process.env.PORT || 4000;
const db_url =
  "mongodb+srv://bc-75:Mongo1234@cluster0-nh7ew.mongodb.net/ToDo?retryWrites=true&w=majority";

const client = new MongoClient(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use(cors());

let data = [];

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
          if (err) throw err;
          res.status(200).send(item);
        });
      client.close();
    }
  );
  // client.connect(err => {
  //   if(!err){
  //   const collection = client.db("ToDo").collection("list");
  //   const results = collection.find({}).toArray((err, docs) => {
  //     res.send(docs);
  //   });
  //   client.close();
  // }else console.log(err)
  // client.close()
  // });
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
      if (err) throw err;
      const db = dbinfo.db("ToDo");
      db.collection("list").insertOne(body, (err, item) => {
        if (err) throw err;
        res.status(200).send(item);
      });
      client.close();
    }
  );

  // client.connect(async err => {
  //   const collection = client.db("ToDo").collection("list");
  //   const results = await collection.insertOne(body);
  //   res.send(results.insertedId);
  //   console.log(results.insertedId);
  //   client.close();
  // });
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

  // client.connect(async err => {
  //   const collection = client.db("ToDo").collection("list");
  //   const results = await collection.updateMany(
  //     { _id: ObjectId(req.params.ID) },
  //     { $set: body }
  //   );
  //   res.send(results);
  //   client.close();
  // });
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
          res.status(200).send(item);
        }
      );
      client.close();
    }
  );
});

// app.delete("/:ID", (req, res) => {
//   client.connect(async err => {
//     const collection = client.db("ToDo").collection("list");
//     const results = await collection.deleteOne({
//       _id: ObjectId(req.params.ID)
//     });
//     res.send(results);
//     client.close();
//   });
// });
app.listen(port, () => {console.log(`Example app listening on port ${port}!`)});
