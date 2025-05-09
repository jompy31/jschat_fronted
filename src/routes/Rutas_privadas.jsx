import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.authentication.token);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      return null;
    }
  }, []);

  return isAuthenticated && currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
