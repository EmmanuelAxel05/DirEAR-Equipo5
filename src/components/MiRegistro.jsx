import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/MiRegistro.css";

export default function MiRegistro({ goToForm }) {
  const { user } = useAuth();
  const [registro, setRegistro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistro = async () => {
      if (!user?.email) return;
      try {
        const q = query(collection(db, "registros_equipos"), where("emailCreador", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setRegistro(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error al buscar registro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistro();
  }, [user]);

  if (isLoading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="spinner"></div>
        <p>Cargando tu información...</p>
      </div>
    );
  }

  if (!registro) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
        </div>
        <h2>Aún no tienes ningún registro</h2>
        <p>Parece que todavía no has guardado la información de tu equipo. Solo se permite un registro por equipo.</p>
        <button className="btn-primary" onClick={goToForm}>
          Llenar Formulario por Primera Vez
        </button>
      </div>
    );
  }

  return (
    <div className="mi-registro-wrapper animate-fade-in">
      {/* Luces de fondo animadas */}
      <div className="bg-glow glow-top-left"></div>
      <div className="bg-glow glow-bottom-right"></div>

      {/* HERO HEADER (Encabezado Destacado) */}
      <div className="profile-hero">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span> Unidad {registro.unidad}
          </div>
          <h1 className="hero-title">{registro.nombreEquipo}</h1>
          <p className="hero-subtitle">{registro.tema}</p>
          <button className="btn-edit-hero" onClick={goToForm}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Editar Registro
          </button>
        </div>
      </div>

      <div className="mi-registro-content">
        {/* SECCIÓN: INFORMACIÓN GENERAL */}
        <div className="section-block">
          <h3 className="section-heading">Información General</h3>
          <div className="info-cards-grid">
            <div className="premium-card">
              <div className="card-icon teal"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
              <span className="card-label">Integrantes</span>
              <p className="card-text">{registro.integrantes}</p>
            </div>
            <div className="premium-card full-width">
              <div className="card-icon orange"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
              <span className="card-label">Información del Tema</span>
              <p className="card-text">{registro.informacionTema}</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN: SUBTEMAS */}
        <div className="section-block">
          <h3 className="section-heading">Subtemas Registrados</h3>
          <div className="subtemas-display-grid">
            {registro.subtemas?.map((sub, i) => (
              <div key={i} className="subtema-display-card">
                {sub.imagenUrl ? (
                  <div className="subtema-img-wrapper">
                    <img src={sub.imagenUrl} alt={sub.titulo} />
                    <div className="img-overlay"></div>
                  </div>
                ) : (
                  <div className="subtema-img-placeholder">Sin Imagen</div>
                )}
                <div className="subtema-display-info">
                  <h4>{sub.titulo}</h4>
                  <p>{sub.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN: RECURSOS Y ENLACES */}
        <div className="section-block">
          <h3 className="section-heading">Recursos y Documentos</h3>
          
          <div className="resources-grid">
            {registro.linkWebinar && (
              <a href={registro.linkWebinar} target="_blank" rel="noreferrer" className="resource-btn webinar">
                <div className="res-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></div>
                <div className="res-text"><span>Webinar</span><strong>Ver Grabación</strong></div>
              </a>
            )}
            {registro.linkReel && (
              <a href={registro.linkReel} target="_blank" rel="noreferrer" className="resource-btn reel">
                <div className="res-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg></div>
                <div className="res-text"><span>Reel</span><strong>Ver Video</strong></div>
              </a>
            )}
            {registro.urlActividadPDF && (
              <a href={registro.urlActividadPDF} target="_blank" rel="noreferrer" className="resource-btn pdf">
                <div className="res-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></div>
                <div className="res-text"><span>Actividad</span><strong>Descargar PDF</strong></div>
              </a>
            )}
            {registro.urlCalificacionesExcel && (
              <a href={registro.urlCalificacionesExcel} target="_blank" rel="noreferrer" className="resource-btn excel">
                <div className="res-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg></div>
                <div className="res-text"><span>Calificaciones</span><strong>Descargar Excel</strong></div>
              </a>
            )}
          </div>

          {registro.fuentes && (
            <div className="fuentes-box">
              <span className="fuentes-label">Fuentes Bibliográficas</span>
              <p>{registro.fuentes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}