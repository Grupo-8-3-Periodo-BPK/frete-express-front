import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function RequiredPermission({ permissions }) {
  const { user, authenticated } = useAuth();

  if (!authenticated) return <Navigate to="/login" />;
  if (
    user &&
    user.role &&
    permissions.some((permission) => user.role.includes(permission))
  )
    return <Outlet />;

  return <Navigate to="/unauthorized" />;
}
export default RequiredPermission;
