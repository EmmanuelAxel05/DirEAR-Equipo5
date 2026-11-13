import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// 1. Importamos el Layout de tu equipo
import Layout from "./components/layout/Layout";

// 2. Importamos las páginas de tu equipo
import Principal from "./components/principal/principal";
import Objetivos from "./components/objetivos/objetivos";
import Unidad from "./components/unidad/unidad";

// 3. Importamos tus páginas (Login y Dashboard)
import Login from "./components/login"; 
import Dashboard from "./js/Dashboard"; 

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ==========================================
            RUTAS DEL EQUIPO (Usan el Layout con menú UTN)
        ========================================== */}
        <Route element={<Layout />}>
          <Route path="/" element={<Principal />} />
          <Route path="/objetivos" element={<Objetivos />} />
          <Route path="/unidad-1" element={<Unidad numero={1} />} />
          <Route path="/unidad-2" element={<Unidad numero={2} />} />
        </Route>

        {/* ==========================================
            TUS RUTAS (Sin el Layout, para que se vean a pantalla completa)
        ========================================== */}
        {/* Ruta pública de tu Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta protegida de tu Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto: si la ruta no existe, va a Principal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;