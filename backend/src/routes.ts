import { Router } from "express";
import { prisma } from "./prisma.js";
import { z } from "zod";
import { getSession } from "@auth/express";
import { authConfig } from "./auth.config.js";
import { getFunFactFor } from "./openAI.js"; 

export const router = Router();

//session 
async function requireSession(req: any, res: any) {
  const session = await getSession(req, authConfig);
  if (!session?.user?.email) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return session;
}

//user detail
router.get("/api/me", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const email = session.user!.email as string; 
  const name = session.user!.name || "User";
  const image = session.user!.image || undefined;

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, image },
    create: { email, name, image }
  });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      favoriteMovie: user.favoriteMovie ?? null
    }
  });
});

//updating the movie
router.post("/api/movie", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const Body = z.object({ favoriteMovie: z.string().trim().min(1).max(120) });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid movie" });

  const email = session.user!.email as string;

  await prisma.user.update({
    where: { email },
    data: { favoriteMovie: parsed.data.favoriteMovie }
  });

  res.sendStatus(204);
});

//returning the fact
router.get("/api/fact", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const email = session.user!.email as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.favoriteMovie) return res.status(400).json({ error: "Favorite movie not set" });

  try {
    const fact = await getFunFactFor(user.favoriteMovie);
    res.json({ fact });
  } catch {
    res.status(503).json({ fact: `Couldn't fetch a fact right now. Try again.` });
  }
});

//logout
router.post("/api/logout", (_req, res) => {
  res.clearCookie("authjs.session-token", { path: "/" });
  res.sendStatus(204);
});
