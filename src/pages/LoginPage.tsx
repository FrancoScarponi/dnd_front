// src/pages/LoginPage.tsx
import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, register, loading, error, initFromStorage, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Levanto sesión previa
  useEffect(() => {
    initFromStorage();
  }, []);

  // Si hay token, me voy a "/"
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    register(email, password);
  };

  return (
    <div>
      <h1>Auth</h1>

      <form>
        <input
          type="email"
          placeholder="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="contraseña"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button disabled={loading} onClick={handleLogin}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>

          <button disabled={loading} onClick={handleRegister} type="button">
            {loading ? "Cargando..." : "Crear usuario"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
