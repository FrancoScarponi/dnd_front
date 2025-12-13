import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Item({
  to,
  label,
  end,
}: {
  to: string;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
        ].join(" ")
      }
    >
      <span className="h-2 w-2 rounded-full bg-zinc-600" />
      {label}
    </NavLink>
  );
}

export default function AppLayout() {
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white w-full overflow-x-hidden">
      <div className="flex">
        <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-zinc-800 md:min-h-screen">
          <div className="p-4 border-b border-zinc-800">
            <div className="text-lg font-bold">DnD Manager</div>
            <div className="text-xs text-zinc-400 mt-1">
              {user?.displayName ? `DM: ${user.displayName}` : "DM Panel"}
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <Item to="/" label="Home" end />
            <Item to="/campaigns" label="Campañas" end/>
            <Item to="/campaigns/new" label="Nueva campaña" />
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

        <header className="md:hidden fixed top-0 left-0 right-0 z-10 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="font-bold">DnD Manager</div>
            <div className="flex items-center gap-2">
              <NavLink
                to="/campaigns"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Campañas
              </NavLink>
              <button
                onClick={onLogout}
                className="text-sm text-zinc-300 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 md:min-h-screen">
          <div className="px-4 py-8 md:px-8 md:py-8 pt-20 md:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
