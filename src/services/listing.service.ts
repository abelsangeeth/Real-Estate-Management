import listingRepository, { ListingFilters } from '../repositories/listing.repository';
import cacheService from './cache.service';
import { Listing, ListingCreateInput, ListingUpdateInput } from '../types/models';
import { AppError } from '../middleware/error.middleware';

export class ListingService {
  async getListings(filters: ListingFilters): Promise<Listing[]> {
    const cacheKey = `listings:query:${JSON.stringify(filters)}`;
    const cached = await cacheService.get<Listing[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const listings = await listingRepository.findAll(filters);
    await cacheService.set(cacheKey, listings, 300); // cache for 5 minutes
    return listings;
  }

  async getListingById(id: string): Promise<Listing> {
    const cacheKey = `listings:id:${id}`;
    const cached = await cacheService.get<Listing>(cacheKey);
    if (cached) {
      return cached;
    }

    const listing = await listingRepository.findById(id);
    if (!listing) {
      throw new AppError(404, 'Property listing not found.');
    }

    await cacheService.set(cacheKey, listing, 300);
    return listing;
  }

  async createListing(data: ListingCreateInput): Promise<Listing> {
    const listing = await listingRepository.create(data);
    await this.invalidateCache(listing.id);
    return listing;
  }

  async updateListing(id: string, data: ListingUpdateInput): Promise<Listing> {
    // Verify listing existence first
    await this.getListingById(id);

    const listing = await listingRepository.update(id, data);
    await this.invalidateCache(id);
    return listing;
  }

  async deleteListing(id: string): Promise<Listing> {
    // Verify listing existence first
    await this.getListingById(id);

    const listing = await listingRepository.delete(id);
    await this.invalidateCache(id);
    return listing;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await cacheService.del(`listings:id:${id}`);
    }
    // Flush overall listing cache queries
    await cacheService.clear();
  }
}

export const listingService = new ListingService();
export default listingService;
