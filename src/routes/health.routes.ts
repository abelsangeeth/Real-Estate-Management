import { FastifyInstance } from 'fastify';
import prisma from '../utils/db';
import cacheService from '../services/cache.service';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    let dbStatus = 'healthy';
    let cacheStatus = 'healthy';
    let isHealthy = true;

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err: any) {
      dbStatus = `unhealthy: ${err.message}`;
      isHealthy = false;
    }

    try {
      const cacheOk = await cacheService.isHealthy();
      if (!cacheOk) {
        cacheStatus = 'unhealthy';
        isHealthy = false;
      }
    } catch (err: any) {
      cacheStatus = `unhealthy: ${err.message}`;
      isHealthy = false;
    }

    const statusCode = isHealthy ? 200 : 500;
    return reply.status(statusCode).send({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        cache: cacheStatus,
      },
    });
  });
}
