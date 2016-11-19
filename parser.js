// scraper.jk

var cheerio = require('cheerio');

/**
* @description Scrap single review
*
* @param {Object} $ cheerio of single review
* @return {Object} Review object {title: "das", body: "das", rating: 4, reviewDate: "June 26, 2015"}
*/

function parseReview($) {
  
  var out = {};
  
  out.title = $.find(".review-title").text();
  out.body = $.find(".review-text").text();
  
  var ratingText = $.find(".review-rating .a-icon-alt").text();
  out.rating = ratingText.substr(0,1);
  
  var reviewDateText = $.find(".review-date").text();
  out.reviewDate = reviewDateText.substr(3, reviewDateText.length);
  
  return out;
  
}

module.exports = {
  
  /**
  * @description Scrap review of page
  *
  * @param {String} params.data HTML of the page
  *
  * @return {Array} Array of Review Object
  */
  
  parseReviews: function(params){
    
    var $ = cheerio.load(params.data);
    
    var reviews = $(".review-views .review");
    
    var parsedReviews = [];
    console.log("reviews page length: ", reviews.length);
    reviews.each(function(i, el) {
      var review = parseReview(cheerio(el));
      parsedReviews.push(review);
    });
    
    return parsedReviews;
    
  },
  
  /**
  * @description Get number of reviews
  *
  * @param {String} params.data HTML of the page
  *
  * @return {Number} Number of pages
  */
  
  parseNumberOfPages: function(params) {
    
    var $ = cheerio.load(params.data);
    
    var pages = $(".a-pagination .page-button a");
    
    return pages.last().text();
    
  }
  
}