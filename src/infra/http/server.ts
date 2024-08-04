/* eslint-disable no-console */

import { Elysia } from "elysia";
import { env } from "../env";
import { authRoutes } from "./routes/authenticate";
import { userRoutes } from "./routes/users";

const app = new Elysia()
  // TODO: create a validation-handler
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION": {
        set.status = 400;
        return { error: error.all };
      }
      default: {
        set.status = 500;
        return new Response(null, { status: 500 });
      }
    }
  })
  .use(authRoutes)
  .use(userRoutes);

app.listen(env.PORT, () =>
  console.log(
    `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
  ),
);
