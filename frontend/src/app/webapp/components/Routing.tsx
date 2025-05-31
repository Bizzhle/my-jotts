import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ConfirmRegistration } from "../../authentication/ConfirmRegistration";
import { ForgotPassword } from "../../authentication/ForgotPassword";
import Login from "../../authentication/Login";
import { ResetPassword } from "../../authentication/ResetPassword";
import { ProtectedRoutes } from "../../libs/auth/RequireAuth";
import Register from "../../registration/Register";
import Layout from "../layout/Layout";
import { LayoutProvider } from "../layout/LayoutContext";
import Category from "../pages/Category";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import { ActivityProvider } from "../utils/contexts/ActivityContext";
import { AuthRedirect } from "../utils/contexts/AuthRedirect";
import { SubscriptionProvider } from "../utils/contexts/SubscriptionContext";
import AccountPage from "./AccountInfo/AccountPage";
import { ChangePassword } from "./AccountInfo/ChangePassword";
import ActivityDetail from "./Activity/ActivityDetail";
import CategoryDetail from "./Category/CategoryDetail";
import WrappedCheckoutForm from "./Subscription/CheckoutForm";
import SubscribePage from "./Subscription/SubscribePage";

const router = createBrowserRouter([
  {
    path: "/",
    loader() {
      return "";
    },
    Component: () => (
      <SubscriptionProvider>
        <ActivityProvider>
          <LayoutProvider>
            <Layout />
          </LayoutProvider>
        </ActivityProvider>
      </SubscriptionProvider>
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
        path: "myAccount",
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
      {
        path: "change-password",
        Component: () => (
          <ProtectedRoutes>
            <ChangePassword />
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
    Component: () => (
      <>
        <Login />
        <AuthRedirect />
      </>
    ),
  },
  {
    path: "/forgot-password",
    Component: () => (
      <LayoutProvider>
        <Layout>
          <ForgotPassword />
        </Layout>
      </LayoutProvider>
    ),
  },
  {
    path: "/reset-password",
    Component: () => (
      <LayoutProvider>
        <Layout>
          <ResetPassword />
        </Layout>
      </LayoutProvider>
    ),
  },
  {
    path: "/account-confirmation",
    Component: () => (
      <LayoutProvider>
        <Layout>
          <ConfirmRegistration />
        </Layout>
      </LayoutProvider>
    ),
  },
]);

export default function Routing() {
  return <RouterProvider router={router} />;
}
