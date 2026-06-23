import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// MongoDB connection for Better Auth's own tables (users, sessions, accounts)
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is required for Better Auth");
}

const client = new MongoClient(mongoUri);
const db = client.db("medicare-connect"); // Same database as your app, separate collections

export const auth = betterAuth({
  database: mongodbAdapter(db),
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

  callbacks: {
    // Called after user signs up or logs in via OAuth
    async onSuccess(ctx) {
      // After successful auth, sync the user into your Express API's Users collection
      // so the doctor/patient/admin roles can be assigned there
      const { user } = ctx;

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name || "",
              email: user.email,
              photo: user.image || "",
              role: "patient", // default role on first signup
            }),
          },
        );
      } catch (error) {
        console.error("Failed to sync user to Express API:", error);
        // Don't fail auth if sync fails — user can still log in locally
      }
    },
  },
});
