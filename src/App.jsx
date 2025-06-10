import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RequirePermission from "./routes/RequiredPermission";
import AdminRoute from "./routes/AdminRoute";
import ClientRoute from "./routes/ClientRoute";
import DriverRoute from "./routes/DriverRoute";
import Register from "./pages/Login/Register";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import PublicRoute from "./routes/PublicRoute";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
// Componente de carregamento
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      <p className="ml-3">Carregando...</p>
    </div>
  );
};

// Componente para página não encontrada
const NotFound = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Página não encontrada</h1>
      <p className="text-gray-500 mb-4">A página que você está procurando não existe.</p>
      <Link 
        to={`${role === "ADMIN" ? "/admin" : role === "CLIENT" ? "/client/freights" : "/driver/freights"}`} 
        className="px-4 py-2 mt-8 text-green-900 bg-white rounded-md hover:bg-gray-100"
      >
        Voltar para o início
      </Link>   
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route>{PublicRoute}</Route>

          {/* Rotas protegidas  */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<RequirePermission permissions={["ADMIN"]} fallback={"/"} />}>
                {AdminRoute}
              </Route>
              <Route element={<RequirePermission permissions={["CLIENT"]} fallback={"/"} />}>
                {ClientRoute}
              </Route>
              <Route element={<RequirePermission permissions={["DRIVER"]} fallback={"/"} />}>
                {DriverRoute}
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
