import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { unidades, integrantes } from "../../data/contenido";
import logo from "../../assets/logo-utn.png";

function Footer() {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    let activo = true;
    getDocs(collection(db, "temas"))
      .then((snap) => {
        if (!activo) return;
        const lista = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
        setTemas(lista);
      })
      .catch(() => activo && setTemas([]));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Institución */}
        <div className="footer__col footer__col--marca">
          <img src={logo} alt="Logo UTN" className="footer__logo" />
          <div>
            <h4>Universidad Tecnológica de Nezahualcóyotl</h4>
            <p>División de Informática y Computación</p>
            <p>Ingeniería en Desarrollo y Gestión de Software</p>
            <p>Asignatura: Dirección de Equipos de Alto Rendimiento</p>
            <p>Cuatrimestre: 2026-3 | 9no Cuatrimestre</p>
            <p>Docente: Mtro. Fernández Hernández Luis Manuel</p>
          </div>
        </div>

        {/* Integrantes */}
        <div className="footer__col">
          <h4>Integrantes del equipo</h4>
          <ul>
            {integrantes.map((nombre) => (
              <li key={nombre}>{nombre}</li>
            ))}
          </ul>
        </div>

        {/* Unidades y temas desde Firebase */}
        {unidades.map((u) => {
          const temasUnidad = temas.filter((t) => t.unidad === u.numero);
          return (
            <div className="footer__col" key={u.numero}>
              <h4>
                <Link to={u.ruta}>
                  Unidad {u.numero}: {u.titulo}
                </Link>
              </h4>
              <ul>
                {temasUnidad.length === 0 ? (
                  <li className="footer__vacio">Sin temas registrados</li>
                ) : (
                  temasUnidad.map((t) => (
                    <li key={t.id}>
                      <Link to={u.ruta}>{t.titulo}</Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="footer__base">
        © 2026 Universidad Tecnológica de Nezahualcóyotl · Dirección de Equipos de Alto Rendimiento
      </div>
    </footer>
  );
}

export default Footer;