import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Login } from "./components/Login";
import { Overview } from "./components/Overview";
import { Products } from "./components/Products";
import { Orders } from "./components/Orders";
import { ContactUs } from "./components/ContactUs";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Overview },
      { path: "products", Component: Products },
      { path: "orders", Component: Orders },
      { path: "contact", Component: ContactUs },
    ],
  },
]);
