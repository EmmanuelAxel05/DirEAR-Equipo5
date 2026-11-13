import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo-utn.png";
import Footer from "../footer/Footer";

function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="pagina">
      <header className="header">
        <div className="header__inner">
          <Link to="/" className="header__marca">
            <img src={logo} alt="Logo UTN" className="header__logo" />
            <div className="header__inst">
              <strong>Universidad Tecnológica de Nezahualcóyotl</strong>
              <span>División de Informática y Computación</span>
            </div>
          </Link>

          <nav className="nav">
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/objetivos">Objetivos</NavLink>
            <NavLink to="/unidad-1">Unidad 1</NavLink>
            <NavLink to="/unidad-2">Unidad 2</NavLink>
            
            {/* NUEVO BOTÓN DE INICIAR SESIÓN */}
            <NavLink 
              to="/login" 
              style={({ isActive }) => ({ 
                marginLeft: "1.5rem", 
                padding: "0.6rem 1.5rem", 
                backgroundColor: isActive ? "#1d6d65" : "#278C83", 
                color: "white", 
                borderRadius: "50px", 
                fontWeight: "700",
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(39, 140, 131, 0.2)"
              })}
            >
              Iniciar Sesión
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="contenido">
        <div key={location.pathname} className="transicion-pagina">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Layout;