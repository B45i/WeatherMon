import { Link, Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import { paths } from "../providers/Router";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export const Home = () => {
  const user = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1f1f1f]">
      <nav className="flex gap-4 p-4 items-center">
        <img src={logo} className="w-40" alt="logo" />
        <Link className="bg-primary px-4 py-2 rounded-full" to={paths.DEVICES}>
          Devices
        </Link>

        <div className="ml-auto">
          <img
            src={user?.photoURL ?? ""}
            className="w-10 h-10 rounded-full border border-secondary hover:border-2 transition-all"
            alt="user"
          />
        </div>
      </nav>
      <main className="grow p-8 pt-4 shrink overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
