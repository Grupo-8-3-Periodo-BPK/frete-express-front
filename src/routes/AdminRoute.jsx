import { Navigate, Outlet, Route } from "react-router-dom";

import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users/Users";
import ManageVehicles from "../pages/Admin/Vehicles/Manage";
import Freights from "../pages/Admin/Freights/Management";
import AdminFreightDetails from "../pages/Admin/Freights/Details";
import Contracts from "../pages/Admin/Contracts/Management";
import Profile from "../pages/Admin/Profile";

const AdminRoute = [
  <Route key="dashboard" path="/admin" element={<Dashboard />} />,
  <Route key="profile" path="/admin/profile" element={<Profile />} />,
  <Route key="users" path="/admin/users" element={<Users />} />,
  <Route key="vehicles" path="/admin/vehicles" element={<ManageVehicles />} />,
  <Route key="freights" path="/admin/freights" element={<Freights />} />,
  <Route
    key="freight-details"
    path="/admin/freights/:id"
    element={<AdminFreightDetails />}
  />,
  <Route key="contracts" path="/admin/contracts" element={<Contracts />} />,
];

export default AdminRoute;
