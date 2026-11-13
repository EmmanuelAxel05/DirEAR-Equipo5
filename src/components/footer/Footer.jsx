import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { unidades, integrantes } from "../../data/contenido";
import logo from "../../assets/logo-utn.png";

function Footer() {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    const cancelar = onSnapshot(
      collection(db, "registros_equipos"),
      (snap) => {
        const lista = snap.docs
          .map((d) => {
            const datos = d.data();
            return {
              id: d.id,
              unidad: Number(datos.unidad),
              titulo: datos.tema || "Sin título",
              orden: datos.orden ?? 0,
            };
          })
          .sort(
            (a, b) =>
              a.orden - b.orden || a.titulo.localeCompare(b.titulo, "es")
          );
        setTemas(lista);
      },
      () => setTemas([])
    );

    return () => cancelar();
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

        {/* Unidades y temas (hipervínculos a cada tema) */}
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
                      <Link to={`/tema/${t.id}`}>{t.titulo}</Link>
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