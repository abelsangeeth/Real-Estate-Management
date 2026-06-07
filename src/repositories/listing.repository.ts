import { Listing, ListingCreateInput, ListingUpdateInput } from '../types/models';
import { mockListings, initMockDb } from '../utils/mockDb';

export interface ListingFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  isFeatured?: boolean;
}

export class ListingRepository {
  async findAll(filters: ListingFilters = {}): Promise<Listing[]> {
    await initMockDb();
    let result = [...mockListings];

    if (filters.location) {
      const locLower = filters.location.toLowerCase();
      result = result.filter((l) => l.location.toLowerCase().includes(locLower));
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((l) => l.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((l) => l.price <= filters.maxPrice!);
    }
    if (filters.bedrooms !== undefined) {
      result = result.filter((l) => l.bedrooms >= filters.bedrooms!);
    }
    if (filters.isFeatured !== undefined) {
      result = result.filter((l) => l.isFeatured === filters.isFeatured);
    }

    return result.sort((a, b) => a.price - b.price);
  }

  async findById(id: string): Promise<Listing | null> {
    await initMockDb();
    const listing = mockListings.find((l) => l.id === id);
    return listing || null;
  }

  async create(data: ListingCreateInput): Promise<Listing> {
    await initMockDb();
    const newListing: Listing = {
      id: `lst-${Date.now()}`,
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      areaSqFt: data.areaSqFt,
      imageUrl: data.imageUrl,
      isFeatured: data.isFeatured ?? false,
      amenities: data.amenities,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockListings.push(newListing);
    return newListing;
  }

  async update(id: string, data: ListingUpdateInput): Promise<Listing> {
    await initMockDb();
    const index = mockListings.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }

    const listing = mockListings[index];
    const updated: Listing = {
      ...listing,
      title: data.title ?? listing.title,
      description: data.description ?? listing.description,
      price: data.price ?? listing.price,
      location: data.location ?? listing.location,
      bedrooms: data.bedrooms ?? listing.bedrooms,
      bathrooms: data.bathrooms ?? listing.bathrooms,
      areaSqFt: data.areaSqFt ?? listing.areaSqFt,
      imageUrl: data.imageUrl ?? listing.imageUrl,
      isFeatured: data.isFeatured ?? listing.isFeatured,
      amenities: data.amenities ?? listing.amenities,
      updatedAt: new Date(),
    };

    mockListings[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<Listing> {
    await initMockDb();
    const index = mockListings.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }
    const deleted = mockListings.splice(index, 1)[0];
    return deleted;
  }
}

export const listingRepository = new ListingRepository();
export default listingRepository;
