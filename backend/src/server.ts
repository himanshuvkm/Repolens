import { buildApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({
      host: env.HOST,
      port: env.PORT,
    });
  } catch (error) {
    logger.error(error, "Failed to start backend server");
    process.exit(1);
  }
}

void start();
