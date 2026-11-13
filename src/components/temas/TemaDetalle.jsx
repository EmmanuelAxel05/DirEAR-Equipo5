import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../reveal/Reveal";
import "../../styles/tema-detalle.css";

function ytId(url = "") {
  const m = url.match(/(?:youtu\.be\/|shorts\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

const esUrl = (txt = "") => /^https?:\/\//i.test(txt.trim());

function Seccion({ titulo, icono, children, delay = 0 }) {
  return (
    <Reveal direction="up" delay={delay}>
      <article className="bloque td-seccion">
        <h2 className="td-seccion__titulo">
          <span className="td-seccion__icono">{icono}</span>
          {titulo}
        </h2>
        {children}
      </article>
    </Reveal>
  );
}

function Video({ url, etiqueta, vertical }) {
  const id = ytId(url);
  return (
    <div className={`td-video ${vertical ? "td-video--vertical" : ""}`}>
      <h3>{etiqueta}</h3>
      {id ? (
        <div className="td-video__marco">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title={etiqueta}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
      <a className="btn" href={url} target="_blank" rel="noopener noreferrer">
        Abrir en YouTube
      </a>
    </div>
  );
}

/* Ficha: imagen al frente, información al reverso */
function FichaVolteable({ numero, subtema }) {
  const [volteada, setVolteada] = useState(false);

  return (
    <button
      type="button"
      className={`td-flip ${volteada ? "td-flip--volteada" : ""}`}
      onClick={() => setVolteada((v) => !v)}
      aria-pressed={volteada}
      aria-label={`${subtema.titulo}. ${volteada ? "Ocultar" : "Ver"} información`}
    >
      <span className="td-flip__interior">
        {/* Frente */}
        <span className="td-flip__cara td-flip__frente">
          {subtema.imagen ? (
            <img src={subtema.imagen} alt={subtema.titulo} loading="lazy" />
          ) : (
            <span className="td-flip__sinimg">{subtema.titulo}</span>
          )}
          <span className="td-flip__num">{numero}</span>
          <span className="td-flip__titulo">{subtema.titulo}</span>
        </span>

        {/* Reverso */}
        <span className="td-flip__cara td-flip__reverso">
          <span className="td-flip__num td-flip__num--reverso">{numero}</span>
          <strong>{subtema.titulo}</strong>
          <span className="td-flip__texto">{subtema.texto}</span>
        </span>
      </span>
    </button>
  );
}

function TemaDetalle({ tema, numeroTema }) {
  const subtemas = tema.subtemas || [];
  const fuentes = tema.fuentes || [];
  const integrantes = tema.integrantes || [];
  const act = tema.actividad || {};

  return (
    <section className="seccion td">
      <Link to={`/unidad-${tema.unidad}`} className="td-volver">
        ← Volver a la Unidad {tema.unidad}
      </Link>

      {/* Portada */}
      <Reveal direction="up">
        <header className="td-hero">
          <div className="td-hero__burbuja td-hero__burbuja--a" />
          <div className="td-hero__burbuja td-hero__burbuja--b" />
          <span className="td-hero__etiqueta">
            Unidad {tema.unidad}
            {numeroTema ? ` · Tema ${numeroTema}` : ""}
          </span>
          <h1 className="td-hero__titulo">{tema.titulo}</h1>
          {tema.descripcion && <p className="td-hero__desc">{tema.descripcion}</p>}
          <div className="td-hero__datos">
            {subtemas.length > 0 && <span>📚 {subtemas.length} subtemas</span>}
            {tema.webinar && <span>🎥 Webinar</span>}
            {tema.reel && <span>📱 Reel</span>}
          </div>
        </header>
      </Reveal>

      {/* Subtemas + imágenes combinados en fichas que voltean */}
      {subtemas.length > 0 && (
        <Seccion titulo="Subtemas" icono="📚">
          <p className="td-flip__ayuda">
            Haz clic en una ficha para ver su información.
          </p>
          <div className="td-flipgrid">
            {subtemas.map((s, i) => (
              <Reveal key={i} direction="up" delay={i * 70}>
                <FichaVolteable
                  numero={String(i + 1).padStart(2, "0")}
                  subtema={s}
                />
              </Reveal>
            ))}
          </div>
        </Seccion>
      )}

      {/* Webinar y reel */}
      {(tema.webinar || tema.reel) && (
        <Seccion titulo="Recursos multimedia" icono="🎥">
          <div className="td-videos">
            {tema.webinar && <Video url={tema.webinar} etiqueta="Webinar" />}
            {tema.reel && <Video url={tema.reel} etiqueta="Reel" vertical />}
          </div>
        </Seccion>
      )}

      {/* Actividad: hipervínculo en otra pestaña */}
      {act.descripcion && (
        <Seccion titulo="Actividad" icono="📝">
          <h3>{act.titulo || "Actividad"}</h3>
          {esUrl(act.descripcion) ? (
            <a
              className="td-enlace"
              href={act.descripcion}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir actividad en otra pestaña ↗
            </a>
          ) : (
            <p>{act.descripcion}</p>
          )}
        </Seccion>
      )}

      {/* Calificaciones */}
      {tema.calificaciones && (
        <Seccion titulo="Calificaciones" icono="📊">
          {esUrl(tema.calificaciones) ? (
            <a
              className="td-enlace"
              href={tema.calificaciones}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir calificaciones en otra pestaña ↗
            </a>
          ) : (
            <p>{tema.calificaciones}</p>
          )}
        </Seccion>
      )}

      {/* Fuentes */}
      {fuentes.length > 0 && (
        <Seccion titulo="Fuentes" icono="🔗">
          <ul className="td-lista">
            {fuentes.map((f, i) => (
              <li key={i}>
                {esUrl(f) ? (
                  <a
                    className="td-enlace"
                    href={f}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {f}
                  </a>
                ) : (
                  f
                )}
              </li>
            ))}
          </ul>
        </Seccion>
      )}

      {/* Integrantes */}
      {integrantes.length > 0 && (
        <Seccion titulo="Integrantes" icono="👥">
          <div className="td-chips">
            {integrantes.map((n, i) => (
              <span key={i} className="td-chip">
                {n}
              </span>
            ))}
          </div>
        </Seccion>
      )}
    </section>
  );
}

export default TemaDetalle;