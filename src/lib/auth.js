import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is required for Better Auth");
}

const client = new MongoClient(mongoUri);
const db = client.db("medicare-connect");

// Helper: push a newly created Better Auth user into the Express API's Users collection
async function syncUserToApi(user) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name || "",
        email: user.email,
        photo: user.image || "",
        role: "patient",
      }),
    });
  } catch (error) {
    console.error("Failed to sync user to Express API:", error.message);
  }
}

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await syncUserToApi(user);
        },
      },
    },
  },

  // Must be the last plugin — handles setting auth cookies correctly
  // inside Next.js Server Actions / Route Handlers.
  plugins: [nextCookies()],
});
