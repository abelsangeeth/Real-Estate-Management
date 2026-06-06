import { Inquiry, Prisma } from '@prisma/client';
import { mockInquiries, mockListings, initMockDb } from '../utils/mockDb';

export class InquiryRepository {
  async create(data: Prisma.InquiryUncheckedCreateInput): Promise<Inquiry> {
    await initMockDb();
    const listing = mockListings.find((l) => l.id === data.listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      message: data.message,
      requestedTourDate: data.requestedTourDate ?? null,
      listingId: data.listingId,
      userId: data.userId ?? null,
      createdAt: new Date(),
      listing: {
        title: listing.title,
        price: listing.price,
        location: listing.location,
      },
    };
    mockInquiries.push(newInquiry);

    const { listing: _, ...inquiryObj } = newInquiry;
    return inquiryObj as Inquiry;
  }

  async findAll(): Promise<any[]> {
    await initMockDb();
    return mockInquiries;
  }

  async findByUserId(userId: string): Promise<any[]> {
    await initMockDb();
    return mockInquiries.filter((i) => i.userId === userId);
  }
}

export const inquiryRepository = new InquiryRepository();
export default inquiryRepository;
