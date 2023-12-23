const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const https = require("https");
const http = require('http')
const fs = require("fs");



dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // Parse JSON bodies (req.body)
app.use(morgan("combined"));
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use("/api/user", userRoutes, limiter);
app.use("/api/blog", blogRoutes, limiter);

//MONGO DB Connection
connectDB();

app.use(mongoSanitize());

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const options = {
  definition: {
    openai: "3.0.0",
    info: {
      title: "Blogs API",
      version: "1.0.0",
      description: "A simple Blogs API with user login functionality",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(specs));

// // start server
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

// Redirect HTTP to HTTPS (Optional)
const httpApp = express();
httpApp.get("*", (req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});
const httpServer = http.createServer(httpApp);
httpServer.listen(80, () => {
  console.log("HTTP server listening on port 80");
});

// Load SSL/TLS certificate and private key
const privateKey = fs.readFileSync("./certs/key.pem", "utf8");
const certificate = fs.readFileSync("./certs/cert.pem", "utf8");
        
const credentials = { key: privateKey, cert: certificate};

// Create an HTTPS server
const server = https.createServer(credentials, app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} (HTTPS)`);
});