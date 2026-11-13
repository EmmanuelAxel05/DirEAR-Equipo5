import { Link } from "react-router-dom";
import { unidades } from "../../data/contenido";
import Reveal from "../reveal/Reveal";

function Principal() {
  return (
    <>
      <section className="hero">
        <p className="hero__carrera">
          Ingeniería en Desarrollo y Gestión de Software
        </p>
        <h1>DIRECCIÓN DE EQUIPOS DE ALTO RENDIMIENTO</h1>
        <p className="hero__desc">
          Esta asignatura desarrolla las competencias para comprender la
          dinámica de los grupos, identificar sus necesidades y ejercer un
          liderazgo que impulse equipos de trabajo eficientes y colaborativos.
        </p>
        <div className="hero__datos">
          <span>Cuatrimestre: 2026-3 | 9no Cuatrimestre</span>
          <span>Docente: Mtro. Fernández Hernández Luis Manuel</span>
        </div>
        <Link to="/objetivos" className="btn btn--acento">
          Objetivos
        </Link>
      </section>
      <br /><br /><br />      <br /><br /><br />
      <section className="unidades">
        {unidades.map((u, i) => (
          <Reveal key={u.numero} direction={i % 2 === 0 ? "left" : "right"}>
            <article className={`card ${i % 2 ? "card--inversa" : ""}`}>
              <div className="card__texto">
                <span className="card__num">Unidad {u.numero}</span>
                <h2>{u.titulo}</h2>
                <p className="card__objetivo">“{u.objetivo}”</p>
                <Link to={u.ruta} className="btn">
                  {u.boton}
                </Link>
              </div>
              <div className="card__img">
                <img src={u.imagen} alt={`Ilustración de ${u.titulo}`} />
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}

export default Principal;