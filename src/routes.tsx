import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Banner from "./pages/banner/Banner";
import MainLayout from "./layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/editor",
        element: <Banner />,
      },
    ],
  },
]);
