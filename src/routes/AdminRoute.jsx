import { Navigate, Outlet, Route } from "react-router-dom";

import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users/Users";
import ManageVehicles from "../pages/Admin/Vehicles/Manage";
import Freights from "../pages/Admin/Freights/Management";
import Contracts from "../pages/Admin/Contracts/Management";

const AdminRoute = [
    <Route key="dashboard" path="/admin" element={<Dashboard/>}/>,
    <Route key="users" path="/admin/users" element={<Users/>}/>,
    <Route key="vehicles" path="/admin/vehicles" element={<ManageVehicles/>}/>,
    <Route key="freights" path="/admin/freights" element={<Freights/>}/>,
    <Route key="contracts" path="/admin/contracts" element={<Contracts/>}/>,
]

export default AdminRoute;