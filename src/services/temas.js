import { db } from "../firebase/config";
import { getDoc, doc, collection, addDoc, updateDoc } from "firebase/firestore";

function listaTexto(valor) {
  if (Array.isArray(valor)) {
    return valor.filter(
      (item) => typeof item === "string" && item.trim()
    );
  }

  return typeof valor === "string"
    ? valor
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

// Busca la URL de la imagen sin importar cómo se haya guardado el campo.
function urlImagen(s) {
  const candidatos = [s?.imagenUrl, s?.imageUrl, s?.imagen];
  const url = candidatos.find(
    (v) => typeof v === "string" && v.trim()
  );
  return url ? url.trim() : "";
}

// Adapta los campos reales de Firebase al diseño de TemaDetalle.
export function normalizarRegistro(id, datos) {
  const subtemas = Array.isArray(datos.subtemas)
    ? datos.subtemas
    : [];

  return {
    id,
    unidad: Number(datos.unidad),
    titulo: datos.tema || "Sin título",
    descripcion: datos.informacionTema || "",

    subtemas: subtemas.map((s) => ({
      titulo: s.titulo || "",
      texto: s.descripcion || "",
      imagen: urlImagen(s),
    })),

    imagenes: subtemas
      .filter((s) => urlImagen(s))
      .map((s) => ({
        src: urlImagen(s),
        alt: s.titulo || "Imagen del subtema",
      })),

    webinar: datos.linkWebinar || "",
    reel: datos.linkReel || "",

    actividad: {
      titulo: datos.urlActividadPDF ? "Actividad (PDF)" : "",
      descripcion: datos.urlActividadPDF || "",
    },

    calificaciones: datos.urlCalificacionesExcel || "",
    fuentes: listaTexto(datos.fuentes),
    integrantes: listaTexto(datos.integrantes),
  };
}

export async function obtenerTema(id) {
  const snap = await getDoc(doc(db, "registros_equipos", id));

  return snap.exists()
    ? normalizarRegistro(snap.id, snap.data())
    : null;
}

export async function guardarTema(datos, id = null) {
  try {
    // Si ya tenemos un ID, actualizamos el documento
    if (id) {
      const docRef = doc(db, "registros_equipos", id);
      await updateDoc(docRef, datos);
      return id;
    }
    // Si no hay ID, creamos un documento nuevo
    const docRef = await addDoc(collection(db, "registros_equipos"), datos);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar el tema en Firestore:", error);
    throw error;
  }
}