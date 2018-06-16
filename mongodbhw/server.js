var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models/article.js");

var PORT = 3000;


var app = express();

var MONGO_URI =  "mongodb://karina:pass123@ds261430.mlab.com:61430/karna_hw_db";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI)

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scraperdb");


app.get("/scrape", function(req, res) {
  
  axios.get("https://www.reddit.com/").then(function(response) {
   
    var $ = cheerio.load(response.data);

    $(".linklisting .link").each(function(i, element) {
      
      var result = {};

     
      result.title = $(this).find("a.title").text();
      console.log(result);

      db.Article.create(result)
        .then(function(dbArticle) {
        
          console.log(dbArticle);
        })
        .catch(function(err) {
        
          return res.json(err);
        });
    });

 
    res.send("Scrape Complete");
  });
});


app.get("/articles", function(req, res) {

})

app.get("/articles/:id", function(req, res) {
});

app.post("/articles/:id", function(req, res) {

});
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

