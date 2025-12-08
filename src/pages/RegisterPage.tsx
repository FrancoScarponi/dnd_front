// src/pages/RegisterPage.tsx
import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const { register, loading, error, initFromStorage, token } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    initFromStorage();
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/app/campaigns", { replace: true });
    }
  }, [token, navigate]);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    register(email, password, displayName);
  };

  return (
    <div>
      <h1>Crear cuenta</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="nombre"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

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
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading} type="submit">
          {loading ? "Cargando..." : "Crear usuario"}
        </button>
      </form>

      <p style={{ marginTop: 8 }}>
        ¿Ya tenés cuenta?{" "}
        <Link to="/login">Ingresar</Link>
      </p>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;
