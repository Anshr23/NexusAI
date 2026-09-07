import 'dotenv/config';
import express from 'express';
import morgan from "morgan";
import appRouter from './routes/index.js'; // Import the appRouter from routes/index.js
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  })
);

//middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1", appRouter); // Use the appRouter for all routes under /api/v1

// Serve frontend static assets from frontend/dist
const frontendDistPath = path.resolve(process.cwd(), "frontend/dist");
app.use(express.static(frontendDistPath));

// Fallback all non-API GET requests to frontend index.html for React Router SPA
app.use((req, res, next) => {
  if (req.method !== "GET" || req.originalUrl.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

export default app; 