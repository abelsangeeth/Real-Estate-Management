import prisma from '../utils/db';
import { Prisma, Listing } from '@prisma/client';

export interface ListingFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  isFeatured?: boolean;
}

export class ListingRepository {
  async findAll(filters: ListingFilters = {}): Promise<Listing[]> {
    const where: Prisma.ListingWhereInput = {};

    if (filters.location) {
      where.location = { contains: filters.location };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }
    if (filters.bedrooms !== undefined) {
      where.bedrooms = { gte: filters.bedrooms };
    }
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    return prisma.listing.findMany({
      where,
      orderBy: { price: 'asc' }, // premium listing sort order
    });
  }

  async findById(id: string): Promise<Listing | null> {
    return prisma.listing.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ListingCreateInput): Promise<Listing> {
    return prisma.listing.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ListingUpdateInput): Promise<Listing> {
    return prisma.listing.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Listing> {
    return prisma.listing.delete({
      where: { id },
    });
  }
}

export const listingRepository = new ListingRepository();
export default listingRepository;
