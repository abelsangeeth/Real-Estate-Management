"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || '127.0.0.1';
const start = async () => {
    try {
        await app_1.default.listen({ port, host });
        logger_1.default.info(`Server is running at http://${host}:${port}`);
        logger_1.default.info(`Interactive API Docs: http://${host}:${port}/docs`);
    }
    catch (err) {
        logger_1.default.error(err, 'Critical failure starting Fastify server:');
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map