import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import apiRoutes from "./routes/api";
import path from "path";

dotenv.config();

// === declare prisma on globalThis for dev hot reload ===
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// === Prisma setup ===
export const prisma =
  globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// register routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
