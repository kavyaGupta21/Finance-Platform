 
import arcjet, { tokenBucket } from "@arcjet/next";

if (!process.env.ARCJET_KEY) {
  throw new Error("ARCJET_KEY is missing");
}

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 2,
      interval: 3600,
      capacity: 2,
    }),
  ],
});

export default aj;