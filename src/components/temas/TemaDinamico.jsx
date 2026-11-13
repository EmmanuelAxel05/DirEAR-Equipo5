import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerTema } from "../../services/temas";
import TemaDetalle from "./TemaDetalle";

function TemaDinamico() {
  const { id } = useParams();
  const [tema, setTema] = useState(null);
  const [estado, setEstado] = useState("cargando");

  useEffect(() => {
    let activo = true;
    setEstado("cargando");
    obtenerTema(id)
      .then((t) => {
        if (!activo) return;
        if (t) { setTema(t); setEstado("ok"); } else setEstado("vacio");
      })
      .catch(() => activo && setEstado("error"));
    return () => { activo = false; };
  }, [id]);

  if (estado === "cargando") return <section className="seccion"><p className="mensaje">Cargando tema...</p></section>;
  if (estado !== "ok")
    return (
      <section className="seccion">
        <p className="mensaje">No se encontró el tema.</p>
        <Link to="/" className="td-volver">← Volver al inicio</Link>
      </section>
    );

  return <TemaDetalle tema={tema} numeroTema={tema.orden} />;
}

export default TemaDinamico;