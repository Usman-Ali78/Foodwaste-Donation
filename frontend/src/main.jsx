import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Routes from "./Routes";
import LoadingSpinner from "./Components/LoadingSpinner";
import { AuthProvider } from "./Context/authContext.jsx";
import { ToastContainer } from "react-toastify";


const router = createBrowserRouter(Routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      </Suspense>
    </AuthProvider> 
  </StrictMode>
);