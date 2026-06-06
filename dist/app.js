"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const path_1 = __importDefault(require("path"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const static_1 = __importDefault(require("@fastify/static"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const listing_routes_1 = __importDefault(require("./routes/listing.routes"));
const inquiry_routes_1 = __importDefault(require("./routes/inquiry.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const app = (0, fastify_1.default)({
    logger: false, // We use our custom logger utility
});
// Centralized Error Handling
app.setErrorHandler(error_middleware_1.errorHandler);
// Security Plugins
app.register(helmet_1.default, {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com"], // allow unsplash placeholders/photos
            scriptSrc: ["'self'", "'unsafe-inline'"],
        },
    },
});
app.register(cors_1.default, {
    origin: true,
    credentials: true,
});
app.register(rate_limit_1.default, {
    max: 100,
    timeWindow: '1 minute',
});
// Auth Plugins
app.register(cookie_1.default, {
    secret: process.env.COOKIE_SECRET || 'aura-luxury-cookie-secret-key-1029',
});
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'aura-luxury-jwt-secret-key-8839',
    cookie: {
        cookieName: 'access_token',
        signed: false,
    },
});
// Swagger Auto-Documentation
app.register(swagger_1.default, {
    openapi: {
        info: {
            title: 'AURA Luxury Real Estate Platform API',
            description: 'High-performance, enterprise-grade REST API powering the AURA luxury real estate website.',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'access_token',
                },
            },
        },
    },
});
app.register(swagger_ui_1.default, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
    },
});
// Serve Frontend Static Site
app.register(static_1.default, {
    root: path_1.default.join(__dirname, '../public'),
    prefix: '/',
});
// Register API Endpoints
app.register(health_routes_1.default);
app.register(auth_routes_1.default, { prefix: '/api/auth' });
app.register(listing_routes_1.default, { prefix: '/api/listings' });
app.register(inquiry_routes_1.default, { prefix: '/api/inquiries' });
exports.default = app;
//# sourceMappingURL=app.js.map