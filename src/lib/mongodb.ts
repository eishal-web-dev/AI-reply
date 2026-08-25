import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

/**
 * Connects to MongoDB, reusing the connection across hot reloads / lambda
 * invocations. Returns null (instead of throwing) when MONGODB_URI is not
 * configured, so the app can fall back to demo mode instead of crashing.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(MONGODB_URI);
}
