import { getEndedAuctions } from "../lib/utils/getEndedAuctions";
import { closeAuction } from "../lib/utils/closeAuction";
import createError from 'http-errors';

async function processAuctions () {
    console.log(`Processing auctions...`);

    try {
        console.log(`Getting all ended auctions still open`);
        const auctionsToClose = await getEndedAuctions();

        const closePromises = auctionsToClose.map(auction => closeAuction(auction));

        await Promise.all(closePromises);

        console.log('All ended auctions still open are now closed');
        return { closed: closePromises.length };

    } catch(error) {
        throw new createError.InternalServerError(error);
    }
}

export const handler = processAuctions;