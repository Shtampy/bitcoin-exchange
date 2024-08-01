import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Error from "./components/Utils/Error";
import HomePage from "./components/Pages/Home/HomePage";
import { Toaster } from 'react-hot-toast';
import SignupPage from "./components/Auth/Signup/SignupPage";
import FavPage from "./components/Pages/Favirotes/FavPage";
import OrderPage from "./components/Pages/Orders/OrdersPage";
import PortfolioPage from "./components/Pages/Portfolio/PortfolioPage";

function App() {
  const router = createBrowserRouter([
    // home page
    {
      path: "/",
      element: (
        <Layout>
          <HomePage />
        </Layout>
      ),
    },
    // portfolio favorites
    {
      path: "/portfolio",
      element: <Layout><PortfolioPage/></Layout>,
    },
    // favorites
    {
      path: "/favorites",
      element: <Layout><FavPage /></Layout>,
    },
    // orders
    {
      path: "/orders",
      element: <Layout><OrderPage /></Layout>,
    },
     // signup
     {
      path: "/signup",
      element: <Layout><SignupPage /></Layout>,
    },
    //any others paths
    {
      path: "/*",
      element: (
        <Layout>
          <Error message={"404 Page not found"} />
        </Layout>
      ),
    },
  ]);

  return <><RouterProvider router={router} /><Toaster /></>;
}

export default App;
