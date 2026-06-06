import { Prisma, Listing } from '@prisma/client';
export interface ListingFilters {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    isFeatured?: boolean;
}
export declare class ListingRepository {
    findAll(filters?: ListingFilters): Promise<Listing[]>;
    findById(id: string): Promise<Listing | null>;
    create(data: Prisma.ListingCreateInput): Promise<Listing>;
    update(id: string, data: Prisma.ListingUpdateInput): Promise<Listing>;
    delete(id: string): Promise<Listing>;
}
export declare const listingRepository: ListingRepository;
export default listingRepository;
