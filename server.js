const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");

// Require all models
const db = require("./models");

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
  console.log("REQ: "+ req);
  let articleInfo = {};

  articleInfo.title = req.body.title;
  articleInfo.webURL = req.body.webUrl;

  entry = new db.Article(articleInfo);
  
  db.Article.create(entry)
  .then(function(dbArticle) {
  // View the added result in the console
  console.log(dbArticle);
  })
  .catch(function(err) {
  // If an error occurred, send it to the client
  return res.json(err);
  });
  console.log("Article added to database.")
});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
