import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import { authConfig } from "./auth.config.js";
import { router } from "./routes.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.set("trust proxy", true);
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());


app.use("/auth/*", ExpressAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    })
  ]
}));

// personal routes
app.use(router);

// test
app.get("/health", (_req, res) => res.json({ msg: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
