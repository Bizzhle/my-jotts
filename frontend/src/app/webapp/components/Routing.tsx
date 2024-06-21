import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Layout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";

const routes = createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path="/" element={<HomePage />} />

    <Route path="/" errorElement={<ErrorPage />} />
  </Route>
);

const router = createBrowserRouter(routes);

export default function Routing() {
  return <RouterProvider router={router} />;
}
