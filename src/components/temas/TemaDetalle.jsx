import { Link } from "react-router-dom";
import Reveal from "../reveal/Reveal";
import "../../styles/tema-detalle.css";

function ytId(url = "") {
  const m = url.match(/(?:youtu\.be\/|shorts\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

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
      <a className="btn" href={url} target="_blank" rel="noreferrer">
        Abrir en YouTube
      </a>
    </div>
  );
}

function TemaDetalle({ tema, numeroTema }) {
  const subtemas = tema.subtemas || [];
  const imagenes = tema.imagenes || [];
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

      {subtemas.length > 0 && (
        <Seccion titulo="Subtemas" icono="📚">
          <div className="td-grid">
            {subtemas.map((s, i) => (
              <Reveal key={i} direction="up" delay={i * 90}>
                <div className="td-item">
                  <span className="td-item__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.titulo}</h3>
                  <p>{s.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Seccion>
      )}

      {imagenes.length > 0 && (
        <Seccion titulo="Galería" icono="🖼️">
          <div className="td-galeria">
            {imagenes.map((img, i) => (
              <figure key={i} className="td-galeria__fig">
                <img src={img.src} alt={img.alt || tema.titulo} loading="lazy" />
                {img.alt && <figcaption>{img.alt}</figcaption>}
              </figure>
            ))}
          </div>
        </Seccion>
      )}

      {(tema.webinar || tema.reel) && (
        <Seccion titulo="Recursos multimedia" icono="🎥">
          <div className="td-videos">
            {tema.webinar && <Video url={tema.webinar} etiqueta="Webinar" />}
            {tema.reel && <Video url={tema.reel} etiqueta="Reel" vertical />}
          </div>
        </Seccion>
      )}

      {act.titulo && (
        <Seccion titulo="Actividad" icono="📝">
          <h3>{act.titulo}</h3>
          {act.descripcion && <p>{act.descripcion}</p>}
        </Seccion>
      )}

      {tema.calificaciones && (
        <Seccion titulo="Calificaciones" icono="📊">
          <a className="btn" href={tema.calificaciones} download>
            Descargar Excel
          </a>
        </Seccion>
      )}

      {fuentes.length > 0 && (
        <Seccion titulo="Fuentes" icono="🔗">
          <ul className="td-lista">
            {fuentes.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </Seccion>
      )}

      {integrantes.length > 0 && (
        <Seccion titulo="Integrantes del equipo" icono="👥">
          <div className="td-chips">
            {integrantes.map((n, i) => (
              <span className="td-chip" key={i} style={{ animationDelay: `${i * 80}ms` }}>
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