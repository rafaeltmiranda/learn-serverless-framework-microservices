import commonMiddleware from "../lib/middlewares/commonMiddleware";
import { getAuctionById } from "./getAuction";
import { uploadPictureToS3 } from "../lib/utils/uploadPictureToS3";
import createError from 'http-errors';
import { setAuctionPictureUrl } from "../lib/utils/setAuctionPicture";

async function uploadAuctionPicture(event) {
    const { id } = event.pathParameters;
    const { email } = event.requestContext.authorizer;
    const auction = await getAuctionById(id);
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    let updatedAuction;

    if (auction.status !== 'OPEN') {
        throw new createError.Forbidden('This auction is CLOSED and it cannot be edited');
    }

    if (auction.seller !== email) {
        throw new createError.Forbidden(`Only the owner can upload picture`);
    }

    try {
        const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);

        updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);

    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction)
    };
}

export const handler = commonMiddleware(uploadAuctionPicture);