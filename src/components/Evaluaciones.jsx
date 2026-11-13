import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import "../styles/Evaluaciones.css";

export default function Evaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "registros_equipos"));
        
        const data = [];
        querySnapshot.forEach((doc) => {
          const registro = doc.data();
          // Solo agregamos los equipos que SÍ subieron un Excel
          if (registro.urlCalificacionesExcel) {
            // Extraemos el nombre del correo (lo que está antes de la @)
            const email = registro.emailCreador || "anonimo@correo.com";
            const nombreUsuario = email.split('@')[0];
            
            data.push({
              id: doc.id,
              equipo: registro.nombreEquipo,
              tema: registro.tema,
              unidad: registro.unidad,
              urlExcel: registro.urlCalificacionesExcel,
              emailCreador: email,
              nombreUsuario: nombreUsuario
            });
          }
        });

        setEvaluaciones(data);
      } catch (error) {
        console.error("Error al cargar evaluaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluaciones();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="spinner"></div>
        <p>Buscando calificaciones en la nube...</p>
      </div>
    );
  }

  return (
    <div className="evaluaciones-wrapper animate-fade-in">
      
      {/* Encabezado Principal */}
      <div className="evaluaciones-header">
        <div className="header-content">
          <h2>Calificaciones de los Equipos</h2>
          <p>Consulta y descarga los archivos Excel subidos por los diferentes equipos.</p>
        </div>
        <div className="header-stats">
          <span className="stat-number">{evaluaciones.length}</span>
          <span className="stat-label">Archivos<br/>Subidos</span>
        </div>
      </div>

      {evaluaciones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>
          </div>
          <h3>No hay calificaciones aún</h3>
          <p>Ningún equipo ha subido su archivo de Excel hasta el momento.</p>
        </div>
      ) : (
        <div className="evaluaciones-list">
          {evaluaciones.map((ev) => (
            <div key={ev.id} className="evaluacion-card">
              
              {/* Info del equipo */}
              <div className="ev-main-info">
                <div className="ev-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>
                </div>
                <div className="ev-text">
                  <h4>{ev.equipo}</h4>
                  <p>{ev.tema} <span className="badge">Unidad {ev.unidad}</span></p>
                </div>
              </div>

              {/* Info de quién lo subió */}
              <div className="ev-uploader">
                <div className="uploader-avatar">
                  {ev.nombreUsuario.charAt(0).toUpperCase()}
                </div>
                <div className="uploader-text">
                  <span className="uploader-label">Subido por</span>
                  <span className="uploader-name" title={ev.emailCreador}>{ev.emailCreador}</span>
                </div>
              </div>

              {/* Botón de descarga */}
              <a href={ev.urlExcel} target="_blank" rel="noreferrer" className="download-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Descargar</span>
              </a>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}