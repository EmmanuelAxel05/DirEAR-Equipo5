import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { unidades } from "../../data/contenido";
import Reveal from "../reveal/Reveal";

function Unidad({ numero }) {
  const unidad = unidades.find((u) => u.numero === numero);
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(false);

    const consulta = query(collection(db, "temas"), where("unidad", "==", numero));

    getDocs(consulta)
      .then((snap) => {
        if (!activo) return;
        const lista = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
        setTemas(lista);
      })
      .catch(() => activo && setError(true))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [numero]);

  return (
    <section className="seccion">
      <div className="unidad-cabecera">
        <div className="unidad-cabecera__texto">
          <span className="card__num">Unidad {unidad.numero}</span>
          <h1 className="seccion__titulo titulo-animado">{unidad.titulo}</h1>
        </div>
        <div className="unidad-cabecera__img">
          <img src={unidad.imagen} alt={`Ilustración de ${unidad.titulo}`} />
        </div>
      </div>

      <Reveal direction="up">
        <article className="bloque bloque--objetivo">
          <h2>Objetivo de la unidad</h2>
          <p>“{unidad.objetivo}”</p>
        </article>
      </Reveal>

      <h2 className="seccion__subtitulo">Temas</h2>

      {cargando && <p className="mensaje">Cargando temas...</p>}
      {error && <p className="mensaje">No se pudieron cargar los temas en este momento.</p>}
      {!cargando && !error && temas.length === 0 && (
        <p className="mensaje">Aún no hay temas registrados para esta unidad.</p>
      )}

      <div className="temas">
        {temas.map((t, i) => (
          <Reveal key={t.id} delay={i * 100}>
            <article className="tema">
              <h3>{t.titulo}</h3>
              {t.descripcion && <p>{t.descripcion}</p>}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Unidad;