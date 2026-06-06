import inquiryRepository from '../repositories/inquiry.repository';
import listingRepository from '../repositories/listing.repository';
import { AppError } from '../middleware/error.middleware';
import { Prisma, Inquiry } from '@prisma/client';

export class InquiryService {
  async createInquiry(data: Prisma.InquiryUncheckedCreateInput): Promise<Inquiry> {
    // Validate listing association
    const listing = await listingRepository.findById(data.listingId);
    if (!listing) {
      throw new AppError(404, 'The requested property listing does not exist.');
    }

    return inquiryRepository.create(data);
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return inquiryRepository.findAll();
  }

  async getInquiriesByUserId(userId: string): Promise<Inquiry[]> {
    return inquiryRepository.findByUserId(userId);
  }
}

export const inquiryService = new InquiryService();
export default inquiryService;
