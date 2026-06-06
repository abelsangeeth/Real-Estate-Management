import { Prisma, Inquiry } from '@prisma/client';
export declare class InquiryRepository {
    create(data: Prisma.InquiryUncheckedCreateInput): Promise<Inquiry>;
    findAll(): Promise<Inquiry[]>;
    findByUserId(userId: string): Promise<Inquiry[]>;
}
export declare const inquiryRepository: InquiryRepository;
export default inquiryRepository;
