import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

import Inicio from "../components/Inicio";
import FormularioCRUD from "../components/FormularioCRUD";
import Evaluaciones from "../components/Evaluaciones";
import MiRegistro from "../components/MiRegistro";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // 1. Verificamos si el usuario logueado es el profesor
  const isProfesor = user?.perfil?.trim()?.toLowerCase() === "profesor";

  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth > 1024);

  // 2. Si es profesor, la vista inicial es "evaluaciones". Si es alumno, es "inicio".
  const [activeView, setActiveView] = useState(isProfesor ? "evaluaciones" : "inicio");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (view) => {
    setActiveView(view);
    if (window.innerWidth <= 1024) setIsMenuOpen(false);
  };

  // 3. Candado de seguridad según el perfil
  useEffect(() => {
    if (isProfesor && activeView !== "evaluaciones") {
      setActiveView("evaluaciones");
    } else if (!isProfesor && activeView === "evaluaciones") {
      setActiveView("inicio");
    }
  }, [isProfesor, activeView]);

  return (
    <div className="dashboard-layout">
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>

        {/* HEADER DEL SIDEBAR */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="logo-text">DirEAR</h2>
          </div>
          <button className="close-menu-btn" onClick={toggleMenu}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="menu-section-title">MENÚ PRINCIPAL</div>

        {/* NAVEGACIÓN CONDICIONAL */}
        <nav className="sidebar-nav">

          {/* SI NO ES PROFESOR, MOSTRAMOS ESTOS BOTONES */}
          {!isProfesor && (
            <>
              <button className={`nav-btn ${activeView === "inicio" ? "active" : ""}`} onClick={() => handleNavClick("inicio")}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </span>
                <span className="nav-text">Principal</span>
              </button>

              <button className={`nav-btn ${activeView === "formulario" ? "active" : ""}`} onClick={() => handleNavClick("formulario")}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </span>
                <span className="nav-text">Formularios CRUD</span>
              </button>

              <button className={`nav-btn ${activeView === "mi-registro" ? "active" : ""}`} onClick={() => handleNavClick("mi-registro")}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <span className="nav-text">Mi Registro</span>
              </button>
            </>
          )}

          {/* EVALUACIONES: SOLO PARA EL PROFESOR */}
          {isProfesor && (
            <button className={`nav-btn ${activeView === "evaluaciones" ? "active" : ""}`} onClick={() => handleNavClick("evaluaciones")}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </span>
              <span className="nav-text">Evaluaciones</span>
            </button>
          )}
        </nav>

        {/* FOOTER DEL SIDEBAR */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-info">
              <span className="user-email" title={user?.email}>{user?.email || "usuario@correo.com"}</span>
              {/* Mostramos el rol real del usuario */}
              <span className="user-role">{user?.perfil?.trim() || "Estudiante"}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <span className="logout-text">Cerrar Sesión</span>
            <svg className="logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className={`main-content ${isMenuOpen ? "shifted" : ""}`}>
        <header className="topbar">
          <button className="hamburger-btn" onClick={toggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* TÍTULO DINÁMICO DE LA BARRA SUPERIOR */}
          <h1 className="topbar-title">
            {activeView === "inicio" && "Panel Principal"}
            {activeView === "formulario" && "Formularios CRUD"}
            {activeView === "mi-registro" && "Mi Registro"}
            {activeView === "evaluaciones" && isProfesor && "Evaluaciones"}
          </h1>
        </header>

        {/* AQUÍ SE RENDERIZAN LAS VISTAS */}
        <div className="content-wrapper">
          {activeView === "inicio" && <Inicio user={user} goToForm={() => setActiveView("formulario")} />}
          {activeView === "formulario" && <FormularioCRUD goToView={() => setActiveView("mi-registro")} />}
          {activeView === "mi-registro" && <MiRegistro goToForm={() => setActiveView("formulario")} />}
          {activeView === "evaluaciones" && isProfesor && <Evaluaciones />}
        </div>
      </main>
    </div>
  );
}
