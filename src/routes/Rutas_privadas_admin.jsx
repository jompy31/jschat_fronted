import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAdmin = useMemo(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      return currentUser?.staff_status === "administrator";
    } catch (error) {
      return false;
    }
  }, []);

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
