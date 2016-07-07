# amazon-reviews-scraper
Simple express app that scrapes amazon product reviews with PhantomJS

This app uses PhantomJS for scraping amazon product reviews. It's using Phantmojs to avoid Amazon scraping protection. Result is saved to CSV file

As scraping with PhantomJS can last a lot longer, so there are 2 routes exposed:
  * /scrap that starts scraping. It expects url parameter, where url is link to first page of product reviews
  * /download route to download resulting CSV
  
I have published this repo as example to help others that have similar tasks. This app was built to serve just 1 user, so keep that in mind
