import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("blood-donation-db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "donor",
        input: false,
      },

      status: {
        type: "string",
        required: true,
        defaultValue: "active",
        input: false,
      },
    },
  },

  plugins: [
    jwt(),
  ],
});