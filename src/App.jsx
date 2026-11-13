import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// 1. Importamos el Layout de tu equipo
import Layout from "./components/layout/Layout";

// 2. Importamos las páginas del equipo
import Principal from "./components/principal/principal";
import Objetivos from "./components/objetivos/objetivos";
import Unidad from "./components/unidad/unidad";
import TeoriaNecesidades from "./components/temas/TeoriaNecesidades";
import TemaDinamico from "./components/temas/TemaDinamico";
import FormularioTema from "./components/temas/FormularioTema";

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
          <Route path="/unidad-1/teoria-de-las-necesidades" element={<TeoriaNecesidades />} />
          <Route path="/tema/:id" element={<TemaDinamico />} />
          <Route path="/agregar-tema" element={<FormularioTema />} />
        </Route>

        {/* ==========================================
            TUS RUTAS (Sin el Layout)
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

        {/* Redirección por defecto: si la ruta no existe, va a la página principal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;