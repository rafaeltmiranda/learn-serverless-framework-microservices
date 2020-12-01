import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from "@middy/validator";
import commonMiddleware from "../lib/middlewares/commonMiddleware";
import schema from "../lib/schemas/getAuctionsSchema";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    let auctions;
    const { status } = event.queryStringParameters;

    console.log(`Getting actions with status: ${status}`);

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    };

    try {
        const result = await dynamodb.query(params).promise();

        auctions = result.Items;
    } catch (err) {
        throw new createError.InternalServerError(`Failed to get auctions from database - ${err}`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions)
    .use(validator({ inputSchema: schema, usedExports: true }));