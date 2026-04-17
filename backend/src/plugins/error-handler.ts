import { FastifyError, FastifyInstance } from "fastify";
import { ZodError } from "zod";

export async function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        issues: error.issues,
      });
    }

    app.log.error(error);
    return reply.status(error.statusCode ?? 500).send({
      message: error.message || "Internal server error",
    });
  });
}
