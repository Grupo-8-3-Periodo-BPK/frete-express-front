import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register"; 
import RegisterClient from "../pages/Login/RegisterClient"
import RegisterDriver from "../pages/Login/RegisterDriver"

const PublicRoute = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="register-client" path="/register/client" element={<RegisterClient />} />,
  <Route key="register-driver" path="/register/driver" element={<RegisterDriver />} />,
];

export default PublicRoute;

