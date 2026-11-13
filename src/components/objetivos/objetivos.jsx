import { objetivoGeneral, competencia } from "../../data/contenido";
import imgObjetivo from "../../assets/objetivo.png";
import imgCompetencia from "../../assets/competencia.png";
import Reveal from "../reveal/Reveal";

function Objetivos() {
  return (
    <section className="seccion">
      <h1 className="seccion__titulo titulo-animado">Objetivos y Competencia</h1>

      <Reveal direction="left">
        <article className="bloque bloque--objetivo bloque--img">
          <div className="bloque__texto">
            <h2>Objetivo general</h2>
            <p>“{objetivoGeneral}”</p>
          </div>
          <div className="bloque__img">
            <img src={imgObjetivo} alt="Ilustración del objetivo general" />
          </div>
        </article>
      </Reveal>

      <Reveal direction="right" delay={150}>
        <article className="bloque bloque--competencia bloque--img bloque--inversa">
          <div className="bloque__texto">
            <h2>Competencia</h2>
            <p>“{competencia}”</p>
          </div>
          <div className="bloque__img">
            <img src={imgCompetencia} alt="Ilustración de la competencia" />
          </div>
        </article>
      </Reveal>
    </section>
  );
}

export default Objetivos;