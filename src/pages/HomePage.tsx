import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div>
      <h1>Home</h1>
      <p>Usuario: {user?.email}</p>

      <button onClick={logoutUser}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default HomePage;
