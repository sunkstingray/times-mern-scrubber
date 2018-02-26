const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var logger = require("morgan");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");

const util = require('util')

// Require all models
const db = require("./models");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytreact";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const mydb = mongoose.connection;

// If there are any errors connecting to the db
mydb.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });
  
// For a successful connection
mydb.once("open", function() {
  console.log("Successfully connected to the Mongoose database!");
});

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//Save Article to DB
app.post("/api/articles", function(req, res) {
  let articleInfo = {};

  articleInfo.title = req.body.title;
  articleInfo.webUrl = req.body.weburl;
  console.log("articleInfo: " + req.body.webUrl);
  db.Article.create(articleInfo)
  .then(function(dbArticle) {
  // View the added result in the console
  console.log(dbArticle);
  console.log("Article added to database.")
  })
  .catch(function(err) {
  // If an error occurred, send it to the client
  return res.json(err);
  });
});

//Delete Article from DB
app.post("/api/delete", function(req, res) {
  const articleId = req.body.id;

  db.Article.findByIdAndRemove(articleId)
  .then(function(dbArticle) {
  // View the added result in the console
  console.log(dbArticle);
  console.log("Article " + articleId + " deleted from database.")
  })
  .catch(function(err) {
  // If an error occurred, send it to the client
  return res.json(err);
  });
});

//Get All Articles from DB
app.get("/api/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
