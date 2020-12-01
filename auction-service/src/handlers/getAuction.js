import AWS from 'aws-sdk';
import commonMiddleware from "../lib/middlewares/commonMiddleware";
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
    let auction;
    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id: id }
        }).promise();

        auction = result.Item;
    } catch (err) {
        throw new createError.InternalServerError(`Failed to get auction from database - ${err}`);
    }

    if (!auction) {
        throw new createError.NotFound(`Auction with id ${id} not found`);
    }

    return auction;
}

async function getAuction(event, context) {

    const { id } = event.pathParameters;

    const auction = await getAuctionById(id);

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction);