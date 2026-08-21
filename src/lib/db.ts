import mongoose from "mongoose";

const DEFAULT_MONGODB_URI =
  "mongodb+srv://rohitsinghrana9991_db_user:rohitsinghrana89@cluster0.rlxyyrx.mongodb.net/video_conference?retryWrites=true&w=majority&appName=Cluster0";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function getExpectedDbName(uri: string): string {
  try {
    const cleanUri = uri.replace(/^mongodb(\+srv)?:\/\//, "http://");
    const parsed = new URL(cleanUri);
    const dbName = parsed.pathname.replace(/^\//, "");
    return dbName || "video_conference";
  } catch {
    return "video_conference";
  }
}

export async function connectDB(): Promise<typeof mongoose> {
  const currentUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
  const expectedDbName = getExpectedDbName(currentUri);

  // If cached connection points to a different database (e.g. old 'univault' from server startup), reset it!
  if (cached.conn) {
    const activeDbName = cached.conn.connection?.db?.databaseName;
    if (activeDbName && activeDbName !== expectedDbName) {
      console.log(`[connectDB] Switching DB connection from "${activeDbName}" to "${expectedDbName}"...`);
      try {
        await mongoose.disconnect();
      } catch {}
      cached.conn = null;
      cached.promise = null;
      global.mongooseCache = { conn: null, promise: null };
    } else if (cached.conn.connection.readyState === 1) {
      return cached.conn;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: expectedDbName,
    };

    cached.promise = mongoose.connect(currentUri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
