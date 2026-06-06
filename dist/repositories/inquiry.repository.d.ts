import { Inquiry, Prisma } from '@prisma/client';
export declare class InquiryRepository {
    create(data: Prisma.InquiryUncheckedCreateInput): Promise<Inquiry>;
    findAll(): Promise<any[]>;
    findByUserId(userId: string): Promise<any[]>;
}
export declare const inquiryRepository: InquiryRepository;
export default inquiryRepository;
