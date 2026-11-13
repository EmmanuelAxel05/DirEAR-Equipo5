import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { normalizarRegistro } from "../../services/temas";
import { unidades } from "../../data/contenido";
import Reveal from "../reveal/Reveal";
import { Link } from "react-router-dom";

function Unidad({ numero }) {
  const unidad = unidades.find((u) => u.numero === numero);

  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setTemas([]);
    setCargando(true);
    setError(false);

    const consulta = query(
      collection(db, "registros_equipos"),
      where("unidad", "in", [
        String(numero),
        Number(numero),
      ])
    );

    const cancelar = onSnapshot(
      consulta,
      (snap) => {
        const lista = snap.docs
          .map((d) =>
            normalizarRegistro(d.id, d.data())
          )
          .sort((a, b) =>
            a.titulo.localeCompare(b.titulo, "es")
          );

        setTemas(lista);
        setError(false);
        setCargando(false);
      },
      (err) => {
        console.error(
          "Error al leer registros_equipos:",
          err
        );

        setTemas([]);
        setError(true);
        setCargando(false);
      }
    );

    return cancelar;
  }, [numero]);

  // Conserva el Tema 1 estático mientras no exista
  // un registro con ese título en Firebase.
  const mostrarEstatica =
    numero === 1 &&
    !cargando &&
    !temas.some(
      (t) => t.titulo === "Teoría de las Necesidades"
    );

  return (
    <section className="seccion">
      <div className="unidad-cabecera">
        <div className="unidad-cabecera__texto">
          <span className="card__num">
            Unidad {unidad.numero}
          </span>

          <h1 className="seccion__titulo titulo-animado">
            {unidad.titulo}
          </h1>
        </div>

        <div className="unidad-cabecera__img">
          <img
            src={unidad.imagen}
            alt={`Ilustración de ${unidad.titulo}`}
          />
        </div>
      </div>

      <Reveal direction="up">
        <article className="bloque bloque--objetivo">
          <h2>Objetivo de la unidad</h2>
          <p>“{unidad.objetivo}”</p>
        </article>
      </Reveal>

      <h2 className="seccion__subtitulo">
        Temas
      </h2>

      {cargando && (
        <p className="mensaje">
          Cargando temas...
        </p>
      )}

      {error && (
        <p className="mensaje" role="alert">
          No se pudieron cargar los temas.
          Revisa el error en la consola del navegador.
        </p>
      )}

      {!cargando &&
        !error &&
        temas.length === 0 &&
        !mostrarEstatica && (
          <p className="mensaje">
            Aún no hay temas registrados para esta unidad.
          </p>
        )}

      <div className="temas">
        {mostrarEstatica && (
          <Reveal>
            <article className="tema">
              <h3>Teoría de las Necesidades</h3>
              <p>Primer tema de la Unidad 1.</p>

              <Link
                className="btn"
                style={{ marginTop: "0.9rem" }}
                to="/unidad-1/teoria-de-las-necesidades"
              >
                Explorar tema
              </Link>
            </article>
          </Reveal>
        )}

        {temas.map((t, i) => (
          <Reveal key={t.id} delay={i * 100}>
            <article className="tema">
              <h3>{t.titulo}</h3>

              {t.descripcion && (
                <p>{t.descripcion}</p>
              )}

              <Link
                className="btn"
                style={{ marginTop: "0.9rem" }}
                to={`/tema/${t.id}`}
              >
                Explorar tema
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Unidad;