import AWS from 'aws-sdk';
import commonMiddleware from "../lib/middlewares/commonMiddleware";
import createError from 'http-errors';
import { getAuctionById } from "./getAuction";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const { email } = event.requestContext.authorizer;

    console.log(`[AuctionId: ${id}][Amount: ${amount}][User: ${email}]`);

    const auction = await getAuctionById(id);

    if (auction.status !== 'OPEN') {
        throw new createError.Forbidden('This auction is CLOSED and it can not accept bids anymore');
    }

    if (amount <= auction.highestBid.amount) {
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
    }

    if (auction.seller === email) {
        throw new createError.Forbidden(`You cannot bid in your own auction`);
    }

    if (auction.highestBid.bidder && auction.highestBid.bidder === email) {
        throw new createError.Forbidden(`Current highest bid is already yours`);
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
            ':amount': amount,
            ':bidder': email
        },
        ReturnValues: 'ALL_NEW'
    };

    let updatedAuction;

    try {
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
    } catch(err) {
        throw new createError.InternalServerError(`Failed to add bid to this auction into database - ${err}`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid);