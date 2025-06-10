import { Route } from "react-router-dom";
import Profile from "../pages/Client/Profile";
import Freights from "../pages/Client/Freight/Freights";
import Contracts from "../pages/Client/Contract/Contract";
import Support from "../pages/Client/Support";
import CreateFreight from "../pages/Client/Freight/Create";
import Rating from "../pages/Client/Rating";
import Home from "../pages/Client/HomePage";

const ClientRoute = [
  <Route key="home" path="/client/home" element={<Home />} />,
  <Route key="profile" path="/client/profile" element={<Profile />} />,
  <Route key="freights" path="/client/freights" element={<Freights />} />,
  <Route key="create-freight" path="/client/freight/create" element={<CreateFreight />} />,
  <Route key="contracts" path="/client/contracts" element={<Contracts />} />,
  <Route key="support" path="/client/support" element={<Support />} />,
  <Route key="rating" path="/client/rating" element={<Rating />} />,
];

export default ClientRoute;