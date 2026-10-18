import connectPgSimple from "connect-pg-simple";
import { pool } from "../../database/index.ts";
import session from "express-session";
import type { RequestHandler } from "express";

const PgSession = connectPgSimple(session);
const isProd = process.env.NODE_ENV === "production";

const authenticate: RequestHandler = session({
  store: new PgSession({
    pool: pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  name: "sid",
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60,
  },
});

export default authenticate;
