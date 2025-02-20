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
import SubscribePage from "./Subscription/SubscribePage";
import WrappedCheckoutForm from "./Subscription/CheckoutForm";

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
            <HomePage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
      {
        path: "activity/:id",
        Component: () => (
          <ProtectedRoutes>
            <ActivityDetail />
          </ProtectedRoutes>
        ),
      },
      {
        path: "categories/:categoryName",
        Component: () => (
          <ProtectedRoutes>
            <CategoryDetail />
          </ProtectedRoutes>
        ),
      },
      {
        path: "categories",
        Component: () => (
          <ProtectedRoutes>
            <Category />
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
        path: "subscription",
        Component: () => (
          <ProtectedRoutes>
            <SubscribePage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "checkout",
        Component: () => (
          <ProtectedRoutes>
            <WrappedCheckoutForm />
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
