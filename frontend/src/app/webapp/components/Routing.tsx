import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import Register from "../../registration/Register";
import NotFoundPage from "../pages/NotFoundPage";
import Login from "../../authentication/Login";
import { ProtectedRoutes } from "../../libs/auth/RequireAuth";
import ActivityDetail from "./Activity/ActivityDetail";
import { ActivityProvider } from "../utils/contexts/ActivityContext";
import CategoryDetail from "./Category/CategoryDetail";
import Category from "../pages/Category";
import AccountPage from "./AccountInfo/AccountPage";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return "";
    },
    Component: () => (
      <ActivityProvider>
        <Layout />
      </ActivityProvider>
    ),
    children: [
      {
        index: true,
        Component: () => (
          <ProtectedRoutes>
            <ActivityProvider>
              <HomePage />
            </ActivityProvider>
          </ProtectedRoutes>
        ),
      },
      {
        path: "protected",
        Component: NotFoundPage,
      },
      {
        path: "activity/:id",
        Component: () => (
          <ProtectedRoutes>
            <ActivityProvider>
              <ActivityDetail />
            </ActivityProvider>
          </ProtectedRoutes>
        ),
      },
      {
        path: "categories/:categoryName",
        Component: () => (
          <ProtectedRoutes>
            <ActivityProvider>
              <CategoryDetail />
            </ActivityProvider>
          </ProtectedRoutes>
        ),
      },
      {
        path: "categories",
        Component: () => (
          <ProtectedRoutes>
            <ActivityProvider>
              <Category />
            </ActivityProvider>
          </ProtectedRoutes>
        ),
      },
      {
        path: "myaccount",
        Component: () => (
          <ProtectedRoutes>
            <AccountPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "subscribe",
        Component: () => (
          <ProtectedRoutes>
            <AccountPage />
          </ProtectedRoutes>
        ),
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
