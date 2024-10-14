import { Link, Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import { paths } from "../providers/Router";

export const Home = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#1f1f1f]">
      <nav className="flex gap-4 p-4 items-center">
        <img src={logo} className="w-40" alt="logo" />
        <Link className="bg-primary px-4 py-2 rounded-full" to={paths.DEVICES}>
          Devices
        </Link>
      </nav>
      <main className="grow p-8 pt-4 shrink overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
