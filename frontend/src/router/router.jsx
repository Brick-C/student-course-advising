import { createBrowserRouter } from "react-router-dom";

import PublicGuard from "./PublicGuard";
import PrivateGard from "./PrivateGuard";
import Login from "../pages/auth/Login";
import Admin from "../pages/admin/Admin";

import Dashboard from "../pages/menu/Dashboard";

const router = createBrowserRouter([
  {
    element: <PublicGuard />,
    children: [
      {
        path: "/admin/login",
        element: <Login />,
      },
    ],
  },

  {
    element: <PrivateGard />,
    children: [
      {
        path: "/admin",
        element: <Admin />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

export default router;
