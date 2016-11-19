var request = require('request-promise'),
    delay = require('timeout-as-promise'),
    parser = require('./parser'),
    phantom = require('phantom');

var sitepage = null;
var phInstance = null;

var reviewUrl = 'https://www.amazon.com/Programming-Language-Beginners-Javascript-Python-ebook/product-reviews/B00WTR45LW/ref=cm_cr_dp_see_all_btm?ie=UTF8&showViewpoints=1&sortBy=recent';

var reviews = [];

function randomDelay(){
  return (Math.random() * 2000) + 4200;
}

function areReviewsDone() {
  // if there are more then 250 reviews, get just last 250
  return reviews.length >= 500;
}

// strip query string from url if exists
function stripQueryString(rawUrl) {
  var ind = rawUrl.indexOf('?');
  if (ind == -1)
    return rawUrl;
  else
    return rawUrl.substr(0,ind);
}

function scrapPagePhantom(params){
  
  var pageNumber = params.pageNumber;
  params.pageNumber++;
  
  if (params.totalNumberOfPages && pageNumber > params.totalNumberOfPages) {
    return Promise.resolve(reviews);
  }
  
  var url = params.url + "?sortBy=recent&pageNumber=" + pageNumber;
  
  return sitepage.open(url)
  .then(status => {
    console.log(status);
    return sitepage.property('content');
  })
  .then(content => {
    sitepage.render('./pageNumber' + pageNumber + '.jpg');
    var parsedReviews = parser.parseReviews({data: content});
    reviews = reviews.concat(parsedReviews);
    
    // parse number of pages
    if (!params.totalNumberOfPages)
      params.totalNumberOfPages = parser.parseNumberOfPages({data: content});
    
    if (areReviewsDone()) {
      return reviews;
    }
    return delay(randomDelay());
  })
  .then(() => {
    
    if (areReviewsDone()) {
      return reviews;
    }
    else {
      return scrapPagePhantom(params);
    }
    
  });
  
}

module.exports = {
  
  phantom: function(params) {
    
    if (!params.url) {
      throw new Error("Missing params.url");
    }
    
    // initialize
    reviews = [];
    
    var url = stripQueryString(params.url);
    
    return phantom.create()
    .then(instance => {
      phInstance = instance;
      return instance.createPage();
    })
    .then(page => {
      sitepage = page;
      return scrapPagePhantom({
        pageNumber: 1,
        url: url
      });
    })
    .then(reviews => {
      sitepage.close();
      phInstance.exit();
      return reviews;
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });
    
    
  }
  
}