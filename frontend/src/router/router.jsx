import { createBrowserRouter } from "react-router-dom";

import publicRouter from "./publicRouter";

const router = createBrowserRouter([...publicRouter], {
  //   future: {
  //     v7_relativeSplatPath: true,
  //     v7_startTransition: true,
  //   },
});

export default router;
