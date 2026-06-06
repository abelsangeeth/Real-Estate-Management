import { ListingFilters } from '../repositories/listing.repository';
import { Prisma, Listing } from '@prisma/client';
export declare class ListingService {
    getListings(filters: ListingFilters): Promise<Listing[]>;
    getListingById(id: string): Promise<Listing>;
    createListing(data: Prisma.ListingCreateInput): Promise<Listing>;
    updateListing(id: string, data: Prisma.ListingUpdateInput): Promise<Listing>;
    deleteListing(id: string): Promise<Listing>;
    private invalidateCache;
}
export declare const listingService: ListingService;
export default listingService;
