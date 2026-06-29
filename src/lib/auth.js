
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"])
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";


const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  }, 
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  user:{
    additionalFields:{
        role: {
            type:"string",
            required:true,
            defaultValue:"donor",
        },
        bloodGroup: {
        type: "string",
        required: true,
      },
      district: {
        type: "string",
        required: true,
      },
      upazila: {
        type: "string",
        required: true,
      },
    }
  },
  session:{
    cookieCache:{
      enabled: true,
      strategy:'jwt',
      maxAge:60*24*30
    }

  },
  plugins:[
    jwt()
  ]

});