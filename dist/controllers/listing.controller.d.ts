import { FastifyRequest, FastifyReply } from 'fastify';
export declare class ListingController {
    getListings(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getListingById(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createListing(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateListing(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteListing(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const listingController: ListingController;
export default listingController;
