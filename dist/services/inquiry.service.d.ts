import { Prisma, Inquiry } from '@prisma/client';
export declare class InquiryService {
    createInquiry(data: Prisma.InquiryUncheckedCreateInput): Promise<Inquiry>;
    getAllInquiries(): Promise<Inquiry[]>;
    getInquiriesByUserId(userId: string): Promise<Inquiry[]>;
}
export declare const inquiryService: InquiryService;
export default inquiryService;
