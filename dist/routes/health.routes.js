"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = healthRoutes;
const cache_service_1 = __importDefault(require("../services/cache.service"));
async function healthRoutes(fastify) {
    fastify.get('/health', async (request, reply) => {
        let dbStatus = 'healthy';
        let cacheStatus = 'healthy';
        let isHealthy = true;
        // In-memory mock database is always healthy
        dbStatus = 'healthy (in-memory)';
        try {
            const cacheOk = await cache_service_1.default.isHealthy();
            if (!cacheOk) {
                cacheStatus = 'unhealthy';
                isHealthy = false;
            }
        }
        catch (err) {
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
//# sourceMappingURL=health.routes.js.map