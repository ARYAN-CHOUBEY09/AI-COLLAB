
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import Project from "../screens/Project";
import Landing from "../screens/Landing";

import UserAuth from "../auth/UserAuth";
import Navbar from "../components/navbar";
import PublicNavbar from "../components/PublicNavbar";

const Layout = () => {
  const location = useLocation();

  // PUBLIC pages (no login required)
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicPage = publicRoutes.includes(location.pathname);

  return (
    <>
      {/* Public navbar on landing, login, register */}
      {isPublicPage && <PublicNavbar />}

      {/* Private navbar on authenticated pages */}
      {!isPublicPage && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/projects"
          element={
            <UserAuth>
              <Home />
            </UserAuth>
          }
        />
        <Route
          path="/project"
          element={
            <UserAuth>
              <Project />
            </UserAuth>
          }
        />
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default AppRoutes;