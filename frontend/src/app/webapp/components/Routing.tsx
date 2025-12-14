import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ConfirmRegistration } from "../../authentication/ConfirmRegistration";
import { ForgotPassword } from "../../authentication/ForgotPassword";
import Login from "../../authentication/Login";
import { ResetPassword } from "../../authentication/ResetPassword";
import { ProtectedRoute } from "../../libs/auth/ProtectedRoute";
import { RequiresAdminPermission } from "../../libs/auth/RequiresAdminPermission";
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
import { Contact } from "./Contact/contact";
import AdminDashboard from "./Dashboard/Admin-Dashboard";
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
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
      {
        path: "activity/:id",
        Component: () => (
          <ProtectedRoute>
            <ActivityDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories/:categoryId",
        Component: () => (
          <ProtectedRoute>
            <CategoryDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories",
        Component: () => (
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        ),
      },
      {
        path: "myAccount",
        Component: () => (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "subscription",
        Component: () => (
          <ProtectedRoute>
            <SubscribePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        Component: () => (
          <ProtectedRoute>
            <WrappedCheckoutForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        Component: () => (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        Component: () => (
          <ProtectedRoute>
            <RequiresAdminPermission>
              <AdminDashboard />
            </RequiresAdminPermission>
          </ProtectedRoute>
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
    path: "/verify-email",
    Component: () => (
      <LayoutProvider>
        <Layout>
          <ConfirmRegistration />
        </Layout>
      </LayoutProvider>
    ),
  },
  {
    path: "/contact-us",
    Component: () => (
      <LayoutProvider>
        <Layout>
          <Contact />
        </Layout>
      </LayoutProvider>
    ),
  },
]);

export default function Routing() {
  return <RouterProvider router={router} />;
}
