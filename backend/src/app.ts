import 'dotenv/config';
import express from 'express';
import morgan from "morgan"
import appRouter from './routes/index.js'; // Import the appRouter from routes/index.js
import cookieParser from 'cookie-parser';
import cors from "cors";
const app = express();

const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");

const allowedOrigins = [
  "http://localhost:5173",
  frontendUrl,
  frontendUrl ? `${frontendUrl}/` : undefined,
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

// app.use(morgan('dev')); // HTTP request logger middleware

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

app.use("/api/v1", appRouter); // Use the appRouter for all routes under /api/v1

export default app; 