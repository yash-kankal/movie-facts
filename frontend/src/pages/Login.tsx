const API = import.meta.env.VITE_API_URL as string;

export default function Login() {
  const googleHref = `${API}/auth/signin?provider=google`;

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <div style={{ padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h1 style={{ marginBottom: 12 }}>Movie Facts</h1>
        <p style={{ marginBottom: 16 }}>Sign in to continue</p>
        <a href={googleHref}>
          <button>Continue with Google</button>
        </a>
      </div>
    </div>
  );
}
