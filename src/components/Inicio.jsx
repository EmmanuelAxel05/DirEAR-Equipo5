import "../styles/Inicio.css";

export default function Inicio({ user, goToForm }) {
  const userName = user?.email ? user.email.split('@')[0] : "Usuario";

  return (
    <div className="animate-fade-in inicio-container">
      
      {/* TARJETA HERO (BIENVENIDA) */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Hola, <span>{userName}</span>
            {/* Icono SVG del Sol animado */}
            <svg className="sun-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </h1>
          <p className="welcome-subtitle">
            Bienvenido de nuevo al sistema de gestión de alto rendimiento.
          </p>
        </div>
        {/* Esferas de luz animadas en el fondo */}
        <div className="mesh-glow glow-1"></div>
        <div className="mesh-glow glow-2"></div>
        <div className="mesh-glow glow-3"></div>
      </div>

      {/* GRID DE TARJETAS (PROFUNDIDAD) */}
      <div className="cards-grid">
        
        {/* TARJETA DE PERFIL */}
        <div className="glass-card profile-card animate-fade-in delay-1">
          <div className="card-header">
            <h2 className="card-title">Tu Perfil Asignado</h2>
            <div className="status-pill">
              <span className="status-dot"></span>
              Activo
            </div>
          </div>
          
          <div className="card-content">
            <div className="info-group">
              <span className="info-label">Perfil</span>
              <span className="badge badge-menta">{user?.perfil?.trim() || "No asignado"}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Unidad</span>
              <span className="badge badge-verde">{user?.unidad || "No asignada"}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Tema Asignado</span>
              <span className="badge badge-azul">{user?.temaAsignado || "Ninguno"}</span>
            </div>
          </div>
        </div>

        {/* TARJETA DE ACCIÓN */}
        <div className="glass-card action-card animate-fade-in delay-2">
          <div className="action-icon-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          
          <h2 className="card-title">Próximos Pasos</h2>
          <p className="action-description">
            Listo para construir el formulario CRUD (integrantes, subtemas con imágenes, webinar, reel, PDF y calificaciones en Excel).
          </p>
          
          <button className="btn-premium" onClick={goToForm}>
            <span className="btn-text">Comenzar a Crear</span>
            <div className="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="btn-shine"></div>
          </button>
        </div>

      </div>
    </div>
  );
}