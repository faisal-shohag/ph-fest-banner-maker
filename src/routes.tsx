import { createBrowserRouter, Outlet } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import ProtectedRoute from "./protected-route";
import CanvasProvider from "./contexts-providers/canvas-provider";
import Home from "./pages/Home/Home";
import Templates from "./pages/Templates/Templates";
import  Contribute from "./pages/contribute/Contribute";
import Editor from "./pages/canvas-editor/editor/Editor";
import MyCanvas from "./pages/my-canvas/MyCanvas";


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
        path: "/templates",
        element: <Templates/>,
      },
      {
        path: "/template/:id",
        element: <div>Template</div>,
      },
       {
        path: "/my-canvas",
        element: <ProtectedRoute><MyCanvas/></ProtectedRoute>,
      },

       {
        path: "/contribute",
        element: <Contribute/>,
      },
    ],
  },
  {
    path: "/editor/:id",
    element: (
      <ProtectedRoute>
        <CanvasProvider>
          <Editor />
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
