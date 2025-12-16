import { NavLink, useLocation } from "react-router-dom";


export function Item({
  to,
  label,
  end,
  isActivePath,
}: {
  to: string;
  label: string;
  end?: boolean;
  isActivePath?: (pathname: string) => boolean;
}) {
  const { pathname } = useLocation();

  const active =
    typeof isActivePath === "function" ? isActivePath(pathname) : false;

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => {
        const finalActive = typeof isActivePath === "function" ? active : isActive;

        return [
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
          finalActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
        ].join(" ");
      }}
    >
      <span className="h-2 w-2 rounded-full bg-zinc-600" />
      {label}
    </NavLink>
  );
}