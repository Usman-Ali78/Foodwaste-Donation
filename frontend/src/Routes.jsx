import React, { lazy } from "react";
import App from "./App.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import { Navigate } from "react-router-dom";

const HomePage = lazy(() => import("./Pages/Home/HomePage.jsx"));
const ContactUs = lazy(() => import("./Pages/ContactUs/ContactUs.jsx"));
const About = lazy(() => import("./Pages/About/About.jsx"));
//adminRoutes
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard.jsx"));
const DashboardAdmin = lazy(() => import("./Admin/Dashboard.jsx"));
const ManageUsers = lazy(() => import("./Admin/ManageUsers.jsx"));
const ManageDonations = lazy(() => import("./Admin/ManageDonations.jsx"));
const Reports = lazy(() => import("./Admin/Reports.jsx"));
const MapView = lazy(() => import("./Admin/MapView.jsx"));
//restaurantRoutes
const RestaurantDashboard = lazy(() =>
  import("./Restaurant/RestaurantDashboard.jsx")
);
const Dashboard = lazy(() =>
  import("../src/Components/Donation/Dashboard.jsx")
);
const FoodDonation = lazy(() =>
  import("../src/Components/Donation/Donations.jsx")
);
const NgosNearby = lazy(() => import("./Components/Donation/Map.jsx"));
const Settings = lazy(() => import("./Components/Donation/Settings.jsx"));
//NgoDashboard
const NgoDashboard = lazy(() => import("./Ngo/NgoDashboard.jsx"));
const LoginModal = lazy(() => import("./Login/LoginModal.jsx"));
const SignupModal = lazy(() => import("./Signup/SignupModal.jsx"));
const Unauthorized = lazy(() => import("./Components/Unauthorized.jsx"));
const ForgotPassword = lazy(() =>
  import("../src/Components/ForgotPassword/forgotPassword.jsx")
);
const ResetPassword = lazy(() =>
  import("../src/Components/ResetPassword/ResetPassword.jsx")
);

const Routes = [
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/login", element: <LoginModal /> },
  { path: "/signUp", element: <SignupModal /> },

  // {path:"food-donation", element : "<FoodDonation />"}
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/contactUs", element: <ContactUs /> },
      { path: "/about", element: <About /> },
      { path: "/unauthorized", element: <Unauthorized /> },
    ],
  },
  // Protected routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardAdmin /> },
      { path: "users", element: <ManageUsers /> },
      { path: "donations", element: <ManageDonations /> },
      { path: "reports", element: <Reports /> },
      { path: "map", element: <MapView /> },
      { index: true, element: <Navigate to="dashboard" replace /> },
    ],
  },

  {
    path: "/restaurant",
    element: (
      <ProtectedRoute allowedRoles={["restaurant"]}>
        <RestaurantDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "foodDonation", element: <FoodDonation /> },
      { path: "ngosNearby", element: <NgosNearby /> },
      { path: "settings", element: <Settings /> },
      { index: true, element: <Navigate to="dashboard" replace /> },
    ],
  },

  {
    path: "/ngo",
    element: (
      <ProtectedRoute allowedRoles={["ngo"]}>
        <NgoDashboard />
      </ProtectedRoute>
    ),
  },
];

export default Routes;
