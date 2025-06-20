import { createBrowserRouter, Outlet } from "react-router";
import Banner from "./pages/banner/Banner";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import ProtectedRoute from "./protected-route";
import CanvasProvider from "./contexts-providers/canvas-provider";
import Home from "./pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      
    ],
  },
  {
    path: "/editor/:id",
    element: (
      <ProtectedRoute>
        <CanvasProvider>
          <Banner />
        </CanvasProvider>
      </ProtectedRoute>
    ),
  },
 {
    path: '/auth',
    element: <div><Outlet/></div>,
    children: [
         {
        path: "login",
        element: <Login/>,
      },
      {
        path: "signup",
        element: <Signup/>
      },
    ]
  }
]);
