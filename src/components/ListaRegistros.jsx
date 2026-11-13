// src/components/ListaRegistros.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function ListaRegistros() {
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null); // { id, tema, nombreEquipo }

  // Escucha en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "registros_equipos"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRegistros(data);
    });
    return () => unsubscribe();
  }, []);

  // Eliminar
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      await deleteDoc(doc(db, "registros_equipos", id));
    }
  };

  // Guardar edición (solo campos de texto por simplicidad)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const ref = doc(db, "registros_equipos", editando.id);
    await updateDoc(ref, {
      tema: editando.tema,
      nombreEquipo: editando.nombreEquipo,
      informacionTema: editando.informacionTema,
    });
    setEditando(null);
  };

  return (
    <div className="lista-registros">
      <h2>Registros Guardados</h2>
      {registros.length === 0 && <p>No hay registros aún.</p>}

      {registros.map((reg) => (
        <div key={reg.id} className="registro-card">
          {editando?.id === reg.id ? (
            // Formulario de edición inline
            <form onSubmit={handleUpdate}>
              <input
                value={editando.tema}
                onChange={(e) => setEditando({ ...editando, tema: e.target.value })}
                placeholder="Tema"
                required
              />
              <input
                value={editando.nombreEquipo}
                onChange={(e) => setEditando({ ...editando, nombreEquipo: e.target.value })}
                placeholder="Equipo"
                required
              />
              <textarea
                value={editando.informacionTema}
                onChange={(e) => setEditando({ ...editando, informacionTema: e.target.value })}
                placeholder="Información"
                required
              />
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
            </form>
          ) : (
            // Vista normal
            <>
              <h3>{reg.nombreEquipo}</h3>
              <p><strong>Tema:</strong> {reg.tema}</p>
              <p><strong>Unidad:</strong> {reg.unidad}</p>
              <p><strong>Integrantes:</strong> {reg.integrantes}</p>
              <div className="acciones">
                <button onClick={() => setEditando(reg)}>Editar</button>
                <button onClick={() => handleDelete(reg.id)}>Eliminar</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}