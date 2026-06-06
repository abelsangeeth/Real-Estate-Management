import { FastifyRequest, FastifyReply } from 'fastify';
import inquiryService from '../services/inquiry.service';
import { z } from 'zod';
import { DecodedToken } from '../middleware/auth.middleware';

const createInquirySchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters.'),
  clientEmail: z.string().email('Invalid email address.'),
  clientPhone: z.string().min(6, 'Invalid phone number.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  requestedTourDate: z.string().optional(),
  listingId: z.string(),
});

export class InquiryController {
  async createInquiry(request: FastifyRequest, reply: FastifyReply) {
    const data = createInquirySchema.parse(request.body);

    const decodedUser = request.user as DecodedToken | undefined;
    const userId = decodedUser?.id || null;

    const inquiry = await inquiryService.createInquiry({
      ...data,
      userId,
    });

    return reply.status(201).send({ success: true, data: inquiry });
  }

  async getInquiries(request: FastifyRequest, reply: FastifyReply) {
    const decodedUser = request.user as DecodedToken;
    const userRole = decodedUser.role;

    let inquiries;
    if (userRole === 'admin' || userRole === 'agent') {
      inquiries = await inquiryService.getAllInquiries();
    } else {
      inquiries = await inquiryService.getInquiriesByUserId(decodedUser.id);
    }

    return reply.send({ success: true, data: inquiries });
  }
}

export const inquiryController = new InquiryController();
export default inquiryController;
