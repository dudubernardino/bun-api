import jwt from "@elysiajs/jwt";
import Elysia, { t, type Static } from "elysia";
import { env } from "../../env";

const jwtPayload = t.Object({
  sub: t.String(),
  name: t.String(),
  role: t.String(),
});

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET,
      alg: "HS256", // TODO: RS256 -> Assymetric Sign
      exp: "1d",
      schema: jwtPayload,
    }),
  )
  .derive({ as: "global" }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        auth.set({
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
          value: token,
        });

        return token;
      },
      signOut: () => auth.remove(),
      getCurrentUser: async () => {
        const payload = await jwt.verify(auth.value);

        if (!payload) {
          // TODO: fix error type
          throw new Error("Unauthorized.");
        }

        return {
          userId: payload.sub,
          name: payload.name,
          role: payload.role,
        };
      },
    };
  });
