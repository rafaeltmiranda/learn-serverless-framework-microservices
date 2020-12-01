# Auctions App: Notification Service

Service to manage auctions:
* Send email `sqs event function`

This service consumes messages from a message queue (Simple Queue Service) and process them

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
