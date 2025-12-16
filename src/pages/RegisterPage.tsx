import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";

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
      navigate("/campaigns", { replace: true });
    }
  }, [token, navigate]);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    register(email, password, displayName);
  };

  return (
    <div className=" flex items-center justify-center px-4 bg-zinc-950 min-h-screen">
      <div className="w-100 max-w-md bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Crear cuenta
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="email@ejemplo.com"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors"
          >
            {loading ? "Creando cuenta..." : "Crear usuario"}
          </button>
        </form>

        <p className="text-sm text-zinc-400 text-center mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Ingresar
          </Link>
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
