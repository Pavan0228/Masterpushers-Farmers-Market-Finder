import { app } from "../backend/app.js";
import { connectDB } from "../backend/db/index.js";

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    await connectDB();
    cachedConnection = true;
    return cachedConnection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Connect to database on first request
  await connectToDatabase();
  
  // Vercel routes /api/* to this handler
  // The req.url will be the path after /api (e.g., /v1/auth for /api/v1/auth)
  // We need to reconstruct the full path for Express routes
  const originalUrl = req.url || '';
  
  // If the path doesn't start with /api, add it
  // This ensures Express routes match correctly
  if (!originalUrl.startsWith('/api')) {
    req.url = `/api${originalUrl}`;
  }
  
  // Handle the request with Express app
  return app(req, res);
}

