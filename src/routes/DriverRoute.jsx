import { Route } from "react-router-dom";
import Profile from "../pages/Driver/Profile";
import Freights from "../pages/Driver/Freights/Freights";
import ManageVehicles from "../pages/Driver/Vehicles/ManageVehicles";
import Tracking from "../pages/Driver/Tracking";
import Contract from "../pages/Driver/Contract/Contract";
import Support from "../pages/Driver/Support";
import Rating from "../pages/Driver/Rating";
import FreightDetail from "../pages/Driver/Freights/Details";
import DriverHomePage from "../pages/Driver/HomePage";

const DriverRoute = [
  <Route key="home" path="/driver" element={<DriverHomePage />} />,
  <Route key="profile" path="/driver/profile" element={<Profile />} />,
  <Route key="freights" path="/driver/freights" element={<Freights />} />,
  <Route key="freight-details" path="/driver/freights/:id" element={<FreightDetail />} />,
  <Route key="vehicles" path="/driver/vehicles" element={<ManageVehicles />} />,
  <Route key="tracking" path="/driver/tracking" element={<Tracking />} />,
  <Route key="contracts" path="/driver/contracts" element={<Contract />} />,
  <Route key="support" path="/driver/support" element={<Support />} />,
  <Route key="rating" path="/driver/rating" element={<Rating />} />,
];

export default DriverRoute;
