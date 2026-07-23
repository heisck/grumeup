import { defineConfig } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    url:
      process.env["DATABASE_URL"] ??
      "postgresql://postgres:postgres@localhost:5434/grumeup?schema=public",
  },
});
