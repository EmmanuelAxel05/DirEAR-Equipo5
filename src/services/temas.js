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
    })),

    imagenes: subtemas
      .filter(
        (s) =>
          typeof s.imageUrl === "string" &&
          s.imageUrl.trim()
      )
      .map((s) => ({
        src: s.imageUrl,
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
  const snap = await getDoc(
    doc(db, "registros_equipos", id)
  );

  return snap.exists()
    ? normalizarRegistro(snap.id, snap.data())
    : null;
}