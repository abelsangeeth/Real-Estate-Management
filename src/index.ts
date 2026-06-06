import 'dotenv/config';
import app from './app';
import logger from './utils/logger';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || '127.0.0.1';

const start = async () => {
  try {
    await app.listen({ port, host });
    logger.info(`Server is running at http://${host}:${port}`);
    logger.info(`Interactive API Docs: http://${host}:${port}/docs`);
  } catch (err) {
    logger.error(err, 'Critical failure starting Fastify server:');
    process.exit(1);
  }
};

start();
