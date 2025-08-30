import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL as string;

type MeResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    favoriteMovie?: string | null;
  };
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse["user"] | null>(null);
  const [movieInput, setMovieInput] = useState("");
  const [fact, setFact] = useState("");


  async function fetchMe() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/me`, { credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data: MeResponse = await res.json();
      setMe(data.user);
      if (data.user.favoriteMovie) {
        await fetchFact();
      }
    } finally {
      setLoading(false);
    }
  }

  // Save favorite movie
  async function saveMovie() {
    const mv = movieInput.trim();
    if (!mv) return;
    const res = await fetch(`${API}/api/movie`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ favoriteMovie: mv }),
    });
    if (res.ok) {
      setMe((prev) => (prev ? { ...prev, favoriteMovie: mv } : prev));
      setMovieInput("");
      fetchFact();
    }
  }

  // Get random fun fact
  async function fetchFact() {
    const res = await fetch(`${API}/api/fact`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setFact(data.fact);
    } else {
      setFact("Couldn't fetch a fact right now.");
    }
  }

  // Logout user
  async function logout() {
    await fetch(`${API}/api/logout`, { method: "POST", credentials: "include" });
    window.location.href = "/login";
  }

  useEffect(() => {
    fetchMe();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (!me) return null;

  // Onboarding screen
  if (!me.favoriteMovie) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Welcome, {me.name}</h2>
        <p>What’s your favorite movie?</p>
        <input
          placeholder="e.g., Inception"
          value={movieInput}
          onChange={(e) => setMovieInput(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={saveMovie}>Save</button>
        <div style={{ marginTop: 16 }}>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: 16 }}>
        {me.image && <img src={me.image} alt="avatar" width={60} height={60} style={{ borderRadius: "50%" }} />}
        <p><b>Name:</b> {me.name}</p>
        <p><b>Email:</b> {me.email}</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p><b>Favorite Movie:</b> {me.favoriteMovie}</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p><b>Fun Fact:</b></p>
        <p>{fact || "Click below to load a fact"}</p>
        <button onClick={fetchFact} style={{ marginTop: 8 }}>Refresh Fact</button>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
