import Admin from "../pages/admin/Admin";
import Welcome from "../pages/menu/Welcome";
import PublicGuard from "./PublicGuard";

const publicRouter = [
  {
    element: <PublicGuard />,
    children: [
      {
        path: "/admin",
        element: <Admin />,
        children: [
          {
            path: "welcome",
            element: <Welcome />,
          },
        ],
      },
    ],
  },
];

export default publicRouter;
