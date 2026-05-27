import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ActivityProvider } from "../contexts/ActivityContext";
import { AuthRedirect } from "../contexts/AuthRedirect";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";
import AccountPage from "../features/account/AccountPage";
import { ChangePassword } from "../features/account/ChangePassword";
import ActivityDetail from "../features/activity/ActivityDetail";
import { ConfirmRegistration } from "../features/auth/ConfirmRegistration";
import { ForgotPassword } from "../features/auth/ForgotPassword";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import { ResetPassword } from "../features/auth/ResetPassword";
import CategoryDetail from "../features/category/CategoryDetail";
import { Contact } from "../features/contact/contact";
import AdminDashboard from "../features/dashboard/Admin-Dashboard";
import WrappedCheckoutForm from "../features/subscription/CheckoutForm";
import SubscribePage from "../features/subscription/SubscribePage";
import Layout from "../layout/Layout";
import { LayoutProvider } from "../layout/LayoutContext";
import { ProtectedRoute } from "../libs/auth/ProtectedRoute";
import { RequiresAdminPermission } from "../libs/auth/RequiresAdminPermission";
import Category from "../pages/Category";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

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
      <PublicLayout>
        <ForgotPassword />
      </PublicLayout>
    ),
  },
  {
    path: "/reset-password",
    Component: () => (
      <PublicLayout>
        <ResetPassword />
      </PublicLayout>
    ),
  },
  {
    path: "/verify-email",
    Component: () => (
      <PublicLayout>
        <ConfirmRegistration />
      </PublicLayout>
    ),
  },
  {
    path: "/contact-us",
    Component: () => (
      <PublicLayout>
        <Contact />
      </PublicLayout>
    ),
  },
]);

export default function Routing() {
  return <RouterProvider router={router} />;
}
