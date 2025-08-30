# movie-facts
A personalized dashboard built with React + TypeScript + Express + Prisma + Auth.js that allows users to sign in, set their favourite movie, and get fun facts powered by AI.

Movie Facts 🎬

Personalized movie-facts dashboard built with React + TypeScript + Express + Prisma + Auth.js (Google OAuth).
Users sign in with Google, set a favorite movie, and fetch AI-generated fun facts.

<p align="center"> <img alt="Movie Facts" src="https://placehold.co/1200x420?text=Movie+Facts+Preview" /> </p>
Features

🔐 Google Login via Auth.js (JWT sessions)

👤 Auto user sync on login (Prisma upsert)

🎯 Set/update favorite movie

🤖 AI fun facts for the selected movie

🧭 Clean layout: Dashboard (top-left), Profile + Logout (top-right), Facts centered

🧪 Simple /health endpoint for uptime checks

Tech Stack

Frontend: React, TypeScript, Vite

Backend: Node.js, Express

Auth: Auth.js (@auth/express) + Google OAuth

DB/ORM: PostgreSQL + Prisma

AI: OpenAI (via getFunFactFor helper)

Validation: Zod
