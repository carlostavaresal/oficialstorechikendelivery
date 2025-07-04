
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Pages
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Orders from "./pages/orders/Orders.tsx";
import Products from "./pages/products/Products.tsx";
import Settings from "./pages/settings/Settings.tsx";
import ThemeSettings from "./pages/settings/ThemeSettings.tsx";
import DeliveryAreas from "./pages/delivery/DeliveryAreas.tsx";
import PaymentMethods from "./pages/payment/PaymentMethods.tsx";
import History from "./pages/history/History.tsx";
import Login from "./pages/auth/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import Catalog from "./pages/client/Catalog.tsx";
import CardapioPage from "./pages/client/CardapioPage.tsx";
import Checkout from "./pages/client/Checkout.tsx";
import Success from "./pages/client/Success.tsx";
import OnlineMenu from "./pages/menu/OnlineMenu.tsx";
import LoginSettings from "./pages/security/LoginSettings.tsx";
import PromotionalCodes from "./pages/promotions/PromotionalCodes.tsx";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { initializeTheme } from "./lib/themeUtils.ts";

// Initialize theme from localStorage or default
initializeTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings/theme",
        element: (
          <ProtectedRoute>
            <ThemeSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "delivery",
        element: (
          <ProtectedRoute>
            <DeliveryAreas />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <ProtectedRoute>
            <PaymentMethods />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotions",
        element: (
          <ProtectedRoute>
            <PromotionalCodes />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        ),
      },
      {
        path: "menu",
        element: (
          <ProtectedRoute>
            <OnlineMenu />
          </ProtectedRoute>
        ),
      },
      {
        path: "security",
        element: (
          <ProtectedRoute>
            <LoginSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "client",
        element: <CardapioPage />,
      },
      {
        path: "client/catalog",
        element: <Catalog />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "client/checkout",
        element: <Checkout />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "client/success",
        element: <Success />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
