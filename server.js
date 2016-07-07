var express = require('express'),
    fs = require('fs'),
    scraper = require('./scraper'),
    csv = require('./csv');

var app = express(),
    PORT = 6429,
    downloadFilePath = './reviews.csv';

var running = false;

app.get('/scrap', function(req, res){
  
  var url = req.query.url;
  
  if (running) {
    return res.send('Scraping is already running. To start new scrap, please wait that the current one finishes. To download result, please hit /download route');
  }
  
  if (!url) {
    return res.send('Please provide url parameter');
  }
  
  if (url.indexOf('/product-reviews/') === -1) {
    return res.send('Invalid url. Please provide link which contains /product-reviews/');
  }
  
  try {
    fs.unlinkSync(downloadFilePath);
  }
  catch (e) {
    
  }
  
  running = true;
  
  console.log("scraping: " + url);
  
  
  res.send('Scraping started. It\'s gonna take a 1-3 minutes, depending of the average length of review and number of reviews. when finished, you can download csv at /download route');
  
  scraper.phantom({
    url: url
  }).then(reviews => {
    return csv.toCSV({reviews: reviews});
  })
  .then(csv => {
    fs.writeFileSync(downloadFilePath, csv);
    running = false;
    console.log("Done");
  })
  .catch(err => {
    running = false;
  });
  
});

app.get('/download', function(req, res){
  
  if (running) {
    return res.send('Scraping is still running. Please try again in a few moments');
  }
  
  var exists = fs.existsSync(downloadFilePath);
  
  if (!exists) {
    return res.send("File doesn't exists. Start scraping job first at /scrap url;")
  }
  
  res.sendFile(downloadFilePath, {root: __dirname});
  
});

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT);
});
