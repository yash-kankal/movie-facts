import type { ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";

export const authConfig: ExpressAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
  trustHost: true,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always send users to the frontend after auth
      const client = process.env.CLIENT_ORIGIN!; // e.g., http://localhost:5173
      // If caller provided a relative path, keep it (e.g. /)
      try {
        if (url.startsWith("/")) return client + url;
        const u = new URL(url);
        // If it's our own backend origin, send to client root instead
        if (u.origin === baseUrl) return client + "/";
      } catch {
        // ignore URL parse issues and default
      }
      return client + "/";
    }
  }
};
