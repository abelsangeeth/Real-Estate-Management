import { FastifyRequest, FastifyReply } from 'fastify';
export declare class InquiryController {
    createInquiry(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getInquiries(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const inquiryController: InquiryController;
export default inquiryController;
