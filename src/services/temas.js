import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { supabase } from "../supabase/config";

export async function guardarTema(tema) {
  // 1) Firebase (fuente que lee la página)
  const ref = await addDoc(collection(db, "temas"), {
    ...tema,
    creado: serverTimestamp(),
  });

  // 2) Supabase (respaldo; si falla, no se pierde el tema)
  const { error } = await supabase.from("temas").insert({
    firestore_id: ref.id,
    unidad: tema.unidad,
    orden: tema.orden,
    titulo: tema.titulo,
    datos: tema,
  });
  if (error) console.warn("Supabase:", error.message);

  return { id: ref.id, supabaseOk: !error };
}

export async function obtenerTema(id) {
  const snap = await getDoc(doc(db, "temas", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}