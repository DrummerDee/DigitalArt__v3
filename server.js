const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const connectDB = require('./db');
const { ObjectId } = require("mongodb");
const app = express();
const PORT = 9000;
require("dotenv").config();

connectDB()


//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// server will use router middleware to route request to correct location
app.use('/api/auth',require('./Auth/route'))

// Connect to MongoDB
let db;
const dbConnectionStr = process.env.DB_STRING;
const dbName = "gallery";

MongoClient.connect(dbConnectionStr, {
  useUnifiedTopology: true,
}).then((client) => {
  console.log(`Connected to ${dbName} Database`);
  db = client.db("gallery");
  const commentCollection = db.collection("comments");
  //tells express to use ejs as template
  app.set("view engine", "ejs");

  // grab Welcome page
  app.get("/", (req, res) => {
    res.sendFile("Welcome.html", { root: "public" });
  });

  //grab the hall page
  app.get("/Hall", (req, res) => {
    res.sendFile("Hall.html", { root: "public" });
  });
  //grabs the art page
  app.get("/Gallery", (req, res) => {
    res.sendFile("Gallery.html", { root: "public" });
  });

  // grabs the tribute page 
  app.get("/Tribute",(req,res)=>{
    res.sendFile("Tribute.html",{root: "public"})
  })
  //grabs the bye page
  app.get("/Bye", (req, res) => {
    res.sendFile("Bye.html", { root: "public" });
  });
  // grabs the comment room that needs ejs
  app.get("/Fourteen", (req, res) => {
    commentCollection
      .find()
      .toArray()
      .then((results) => {
        const comments = results.map((result) => {
          console.log(result);
          return { id: new ObjectId(result._id), comment: result.comments };
        });

        res.render("Fourteen.ejs", {
          id: new ObjectId(results._id),
          comment: comments,
        });
      })
      .catch((error) => console.log(error));
  });
  // use method post to get the comment page
  app.post("/comment", (req, res) => {
    commentCollection
      .insertOne(req.body)
      .then((results) => {
        res.redirect("/Fourteen");
        console.log(results);
      })
      .catch((error) => console.log(error));
  });

  // update comment
  app.post("/editComment", (req, res) => {
    const { id, comment } = req.body;
    try {
      const result = commentCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { comments: comment } }
      );
      res.send().json(result);
    } catch (err) {
      console.error(err);
    }
  })



  app.delete("/deleteComment", (req, res) => {
    db.collection("comments").deleteOne({ comments: req.body.comments})
      .then((result) => {
        res.json("Comment Deleted");
      })
      .catch((error) => console.error(error));
  });

//if something goes wrong with server throw an error & close with exit error of 1
process.on('unhandledRejection',err =>{
  console.log(`Error Occurred: ${err.message}`)
  server.close(() => process.exit(1))
});

 const server = app.listen(process.env.PORT || PORT, () => {
    console.log(`You're on ${PORT} babyeee`);
  });
});