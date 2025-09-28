import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout"
import App from "./App"
import Checkout from "./screens/Checkout"
import OrderSuccess from "./screens/OrderSuccess"
import Login from "./screens/Login"
import Register from "./screens/Register"

const router = createBrowserRouter([
  {
    element: <Layout />, // ✅ Wraps children with Header + Footer
    children: [
      { path: "/", element: <App /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/success", element: <OrderSuccess /> }, { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

    ]
  }

])

export default function Routes() {
  return <RouterProvider router={router} />
}
