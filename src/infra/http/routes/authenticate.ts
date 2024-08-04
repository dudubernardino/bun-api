import { db } from "@/infra/database/drizzle/connection";
import Elysia, { t } from "elysia";
import { auth } from "../middlewares/auth";

export const authRoutes = new Elysia({ prefix: "/auth" }).use(auth).post(
  "/",
  async ({ body, signUser }) => {
    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, body.email);
      },
    });

    if (!user) throw new Error("User Not Found");

    const token = await signUser({
      sub: user.id,
      name: user.name,
      role: user.role,
    });

    return { accessToken: token };
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String(),
    }),
  },
);
