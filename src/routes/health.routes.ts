import { FastifyInstance } from 'fastify';
import cacheService from '../services/cache.service';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    let dbStatus = 'healthy';
    let cacheStatus = 'healthy';
    let isHealthy = true;

    // In-memory mock database is always healthy
    dbStatus = 'healthy (in-memory)';

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
