import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Item } from "./ui/Item";

export default function AppLayout() {
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-zinc-950 text-white w-full overflow-x-hidden">
      <div className="flex h-screen"> {/* Cambié min-h-screen por h-screen */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-zinc-800">
          <div className="p-4 border-b border-zinc-800">
            <div className="text-lg font-bold">DnD Manager</div>
            <div className="text-xs text-zinc-400 mt-1">
              {user?.displayName ? `DM: ${user.displayName}` : "DM Panel"}
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <Item to="/" label="Home" end />

            <Item
              to="/campaigns"
              label="Campañas"
              isActivePath={(p) => p.startsWith("/campaigns") && p !== "/campaigns/new"}
            />

            <Item
              to="/campaigns/new"
              label="Nueva campaña"
              isActivePath={(p) => p === "/campaigns/new"}
            />

            <Item to="/characters" label="Personajes" />
          </nav>

          <div className="mt-auto p-4 border-t border-zinc-800">
            <button
              onClick={onLogout}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto h-screen">
          <div className="px-4 py-8 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
