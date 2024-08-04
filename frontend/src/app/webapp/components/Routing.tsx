import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import Register from "../../registration/Register";
import NotFoundPage from "../pages/NotFoundPage";
import Login from "../../authentication/Login";
import { ProtectedRoutes } from "../../libs/auth/RequireAuth";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return "";
    },
    Component: Layout,
    children: [
      {
        index: true,
        Component: () => (
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "protected",
        Component: NotFoundPage,
      },
    ],
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
]);

export default function Routing() {
  return <RouterProvider router={router} />;
}
