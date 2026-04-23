import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function testConnection() {
  const { connectDB } = await import("@/lib/mongodb");
  try {
    const conn = await connectDB();
    console.log("✅ MongoDB connected successfully");
    console.log("   Host    :", conn.connection.host);
    console.log("   DB Name :", conn.connection.name);
    console.log(
      "   State   :",
      conn.connection.readyState === 1 ? "connected" : "disconnected",
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

testConnection();
