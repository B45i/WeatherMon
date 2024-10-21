import { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AuthContext } from "./AuthProvider";

import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { Devices } from "../pages/Devices";
import { Dashboard } from "../pages/Dashboard";
import { DeviceDashboard } from "../pages/DeviceDashboard";

export const paths = {
  LOGIN: "/login",
  HOME: "/",
  DEVICES: "/devices",
  DEVICE: "/devices/:id",
};

export const Router = () => {
  const user = useContext(AuthContext);
  const isLogged = !!user;

  const router = createBrowserRouter([
    {
      path: paths.LOGIN,

      element: isLogged ? <Navigate to={paths.HOME} /> : <Login />,
    },
    {
      path: paths.HOME,
      element: isLogged ? <Home /> : <Navigate to={paths.LOGIN} />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: paths.DEVICES,
          element: <Devices />,
        },
        {
          path: paths.DEVICE,
          element: <DeviceDashboard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
