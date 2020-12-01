# Auctions App: Auctions Service

Service to manage auctions:
* CRUD actions (http event functions
* Bid at an auction (http event function)
* Upload picture to S3 (http event function)
* Process ended auction (schedule rate 1min event function)

## Requirement

* npm
* AWS cli configured
* Serverless installed globally with `npm install -g serverless`

## Deploy

```
// Get dependencies locally
npm install

// Deploy to aws
sls deploy [-v //to get verbose logs]
```

You are ready to go!
