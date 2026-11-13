import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guardarTema } from "../../services/temas";
import "../../styles/formulario-tema.css";

const lineas = (txt) => txt.split("\n").map((l) => l.trim()).filter(Boolean);

function FormularioTema() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    unidad: 1, orden: 1, titulo: "", descripcion: "",
    webinar: "", reel: "", actThTitulo: "", actDesc: "",
    calificaciones: "", fuentes: "", integrantes: "", imagenes: "",
  });
  const [subtemas, setSubtemas] = useState([{ titulo: "", texto: "" }]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setSub = (i, k, v) =>
    setSubtemas(subtemas.map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  async function enviar(e) {
    e.preventDefault();
    setError("");
    if (!f.titulo.trim()) return setError("El título es obligatorio.");
    if (!window.confirm("¿Confirmas que quieres agregar este tema?")) return;

    const tema = {
      unidad: Number(f.unidad),
      orden: Number(f.orden),
      titulo: f.titulo.trim(),
      descripcion: f.descripcion.trim(),
      subtemas: subtemas.filter((s) => s.titulo.trim()),
      imagenes: lineas(f.imagenes).map((src) => ({ src, alt: "" })),
      webinar: f.webinar.trim(),
      reel: f.reel.trim(),
      actividad: { titulo: f.actThTitulo.trim(), descripcion: f.actDesc.trim() },
      calificaciones: f.calificaciones.trim(),
      fuentes: lineas(f.fuentes),
      integrantes: lineas(f.integrantes),
    };

    try {
      setEnviando(true);
      const { id } = await guardarTema(tema);
      navigate(`/tema/${id}`);
    } catch (err) {
      setError("No se pudo guardar: " + err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="seccion">
      <h1 className="seccion__titulo titulo-animado">Agregar tema</h1>
      <form className="bloque ft" onSubmit={enviar}>
        <div className="ft__fila">
          <label>Unidad
            <select value={f.unidad} onChange={set("unidad")}>
              <option value={1}>Unidad 1</option>
              <option value={2}>Unidad 2</option>
            </select>
          </label>
          <label>Número de tema (orden)
            <input type="number" min="1" value={f.orden} onChange={set("orden")} />
          </label>
        </div>

        <label>Tema
          <input value={f.titulo} onChange={set("titulo")} required />
        </label>
        <label>Descripción
          <textarea rows="3" value={f.descripcion} onChange={set("descripcion")} />
        </label>

        <h3>Subtemas</h3>
        {subtemas.map((s, i) => (
          <div className="ft__sub" key={i}>
            <input placeholder="Título del subtema" value={s.titulo}
              onChange={(e) => setSub(i, "titulo", e.target.value)} />
            <textarea rows="2" placeholder="Descripción" value={s.texto}
              onChange={(e) => setSub(i, "texto", e.target.value)} />
            {subtemas.length > 1 && (
              <button type="button" className="ft__quitar"
                onClick={() => setSubtemas(subtemas.filter((_, j) => j !== i))}>Quitar</button>
            )}
          </div>
        ))}
        <button type="button" className="ft__mas"
          onClick={() => setSubtemas([...subtemas, { titulo: "", texto: "" }])}>
          + Agregar subtema
        </button>

        <label>Imágenes (una URL por línea)
          <textarea rows="3" value={f.imagenes} onChange={set("imagenes")} />
        </label>
        <label>Link de video webinar
          <input type="url" value={f.webinar} onChange={set("webinar")} />
        </label>
        <label>Link de reel
          <input type="url" value={f.reel} onChange={set("reel")} />
        </label>
        <label>Actividad (título)
          <input value={f.actThTitulo} onChange={set("actThTitulo")} />
        </label>
        <label>Actividad (descripción)
          <textarea rows="3" value={f.actDesc} onChange={set("actDesc")} />
        </label>
        <label>Calificaciones Excel (URL del archivo)
          <input type="url" value={f.calificaciones} onChange={set("calificaciones")} />
        </label>
        <label>Fuentes (una por línea)
          <textarea rows="3" value={f.fuentes} onChange={set("fuentes")} />
        </label>
        <label>Integrantes / equipo (uno por línea)
          <textarea rows="3" value={f.integrantes} onChange={set("integrantes")} />
        </label>

        {error && <p className="ft__error">{error}</p>}
        <button className="btn" disabled={enviando}>
          {enviando ? "Guardando..." : "Confirmar y guardar"}
        </button>
      </form>
    </section>
  );
}

export default FormularioTema;