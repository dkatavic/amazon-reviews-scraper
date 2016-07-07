var json2csv = require('json2csv');

var fields = ['title', 'body', 'rating', 'reviewDate'];

module.exports = {
  
  /**
  * @description Transform array of reviews to CSV
  +
  * @param {Array} reviews
  *
  * @return {String} csv string
  */
  
  toCSV: function(params) {
    
    if (!params.reviews) {
      throw new Error("Missing params.reviews");
    }
    
    return new Promise(function(resolve, reject) {
      
      json2csv({ data: params.reviews, fields: fields }, function(err, csv) {
        if (err) {
          return reject(err);
        }
        resolve(csv);
      });
      
    });
    
  }
  
};
