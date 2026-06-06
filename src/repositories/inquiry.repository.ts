import prisma from '../utils/db';
import { Prisma, Inquiry } from '@prisma/client';

export class InquiryRepository {
  async create(data: Prisma.InquiryUncheckedCreateInput): Promise<Inquiry> {
    return prisma.inquiry.create({
      data,
    });
  }

  async findAll(): Promise<Inquiry[]> {
    return prisma.inquiry.findMany({
      include: {
        listing: {
          select: {
            title: true,
            price: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: string): Promise<Inquiry[]> {
    return prisma.inquiry.findMany({
      where: { userId },
      include: {
        listing: {
          select: {
            title: true,
            price: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const inquiryRepository = new InquiryRepository();
export default inquiryRepository;
