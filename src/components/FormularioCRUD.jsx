import { useState, useEffect } from "react";
import { db } from "../firebase/config"; 
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from "firebase/firestore"; 
import { supabase } from "../supabaseClient"; 
import { useAuth } from "../context/AuthContext";
import "../styles/FormularioCRUD.css";

const initialFormState = () => ({
  unidad: "1", tema: "", informacionTema: "", nombreEquipo: "", integrantes: "", linkWebinar: "", linkReel: "", fuentes: "",
  subtemas: [{ id: Date.now(), titulo: "", descripcion: "", imagen: null, imagenUrl: null }]
});

export default function FormularioCRUD({ goToView }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormState());
  const [archivoActividad, setArchivoActividad] = useState(null);
  const [archivoExcel, setArchivoExcel] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessMode, setIsSuccessMode] = useState(false); 
  const [documentId, setDocumentId] = useState(null); 
  const [toast, setToast] = useState(null);

  // Buscar si ya existe un registro para este usuario
  useEffect(() => {
    const checkRecord = async () => {
      if (!user?.email) return;
      try {
        const q = query(collection(db, "registros_equipos"), where("emailCreador", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setFormData({ ...initialFormState(), ...docSnap.data() });
          setDocumentId(docSnap.id);
          setIsSuccessMode(true); 
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkRecord();
  }, [user]);

  // Toast de notificaciones
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSubtema = () => {
    setFormData({
      ...formData,
      subtemas: [...formData.subtemas, { id: Date.now(), titulo: "", descripcion: "", imagen: null, imagenUrl: null }]
    });
  };

  const handleRemoveSubtema = (id) => {
    setFormData({
      ...formData,
      subtemas: formData.subtemas.filter((sub) => sub.id !== id)
    });
  };

  const handleSubtemaChange = (id, field, value) => {
    const updatedSubtemas = formData.subtemas.map((sub) =>
      sub.id === id ? { ...sub, [field]: value } : sub
    );
    setFormData({ ...formData, subtemas: updatedSubtemas });
  };

  const sanitizeFileName = (name) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, ''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Procesar Subtemas
      const subtemasProcesados = await Promise.all(formData.subtemas.map(async (sub) => {
        if (sub.imagen) {
          const cleanName = sanitizeFileName(sub.imagen.name);
          const fileName = `subtemas/${Date.now()}-${cleanName}`;
          
          const { error } = await supabase.storage.from('tema-imagenes').upload(fileName, sub.imagen, { upsert: true }); 
          if (error) throw error;

          const { data: urlData } = supabase.storage.from('tema-imagenes').getPublicUrl(fileName);
          return { ...sub, imagenUrl: urlData.publicUrl, imagen: null };
        }
        return sub;
      }));

      // 2. Subir PDF
      let pdfUrl = formData.urlActividadPDF || null;
      if (archivoActividad) {
        const cleanPdfName = sanitizeFileName(archivoActividad.name);
        const pdfName = `documentos/${Date.now()}-${cleanPdfName}`;
        const { error } = await supabase.storage.from('actividades').upload(pdfName, archivoActividad, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('actividades').getPublicUrl(pdfName);
        pdfUrl = urlData.publicUrl;
      }

      // 3. Subir Excel
      let excelUrl = formData.urlCalificacionesExcel || null;
      if (archivoExcel) {
        const cleanExcelName = sanitizeFileName(archivoExcel.name);
        const excelName = `calificaciones/${Date.now()}-${cleanExcelName}`;
        const { error } = await supabase.storage.from('der-calificaciones').upload(excelName, archivoExcel, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('der-calificaciones').getPublicUrl(excelName);
        excelUrl = urlData.publicUrl; // Corrección de tipeo aquí
      }

      // 4. Datos finales
      const dataToSave = {
        ...formData,
        emailCreador: user?.email || "anonimo@correo.com",
        subtemas: subtemasProcesados,
        urlActividadPDF: pdfUrl,
        urlCalificacionesExcel: excelUrl,
        fechaRegistro: formData.fechaRegistro || new Date()
      };

      // 5. Guardar o Actualizar
      if (documentId) {
        const docRef = doc(db, "registros_equipos", documentId);
        await updateDoc(docRef, dataToSave);
        setToast({ message: "Registro actualizado correctamente.", type: "success" });
      } else {
        const docRef = await addDoc(collection(db, "registros_equipos"), dataToSave);
        setDocumentId(docRef.id);
        setToast({ message: "Registro guardado exitosamente.", type: "success" });
      }

      setFormData(dataToSave);
      setIsSuccessMode(true); 
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Error al guardar:", error);
      setToast({ message: error.message || "Hubo un error.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container animate-fade-in">
        <div className="spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  // --- PANTALLA DE ÉXITO ---
  if (isSuccessMode) {
    return (
      <div className="crud-container success-container animate-fade-in">
        <div className="success-glow glow-1"></div>
        <div className="success-glow glow-2"></div>
        
        <div className="success-content">
          <div className="success-icon-box">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="checkmark">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="success-title">¡Registro Guardado!</h2>
          <p className="success-text">
            La información de tu equipo <strong>{formData.nombreEquipo || "Sin nombre"}</strong> ha sido almacenada exitosamente.
          </p>
          
          <div className="success-actions">
            <button className="btn-edit-action" onClick={() => setIsSuccessMode(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Editar mi Registro
            </button>
            <button className="btn-view-action" onClick={goToView}>
              Ver mi Registro Completo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DE FORMULARIO ---
  return (
    <div className="crud-container animate-fade-in">
      
      <div className="bg-glow-accent"></div>

      {toast && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-message"><p>{toast.message}</p></div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="crud-form">
        
        {documentId && (
          <div className="premium-edit-banner">
            <div className="edit-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <div className="edit-text-wrapper">
              <h4>Modo Edición Activado</h4>
              <p>Estás modificando un registro existente. Los cambios se actualizarán en la base de datos.</p>
            </div>
          </div>
        )}

        {/* SECCIÓN 1: DATOS GENERALES */}
        <div className="form-section">
          <h3 className="section-title">1. Información General</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Selección de Unidad</label>
              <select name="unidad" value={formData.unidad} onChange={handleInputChange}>
                <option value="1">Unidad 1</option>
                <option value="2">Unidad 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tema Principal</label>
              <input type="text" name="tema" value={formData.tema} onChange={handleInputChange} placeholder="Ej. Manejo de Grupos" required />
            </div>
            <div className="form-group">
              <label>Nombre del Equipo</label>
              <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleInputChange} placeholder="Ej. Los Innovadores" required />
            </div>
            <div className="form-group full-width">
              <label>Integrantes</label>
              <textarea name="integrantes" value={formData.integrantes} onChange={handleInputChange} rows="2" placeholder="Escribe los nombres separados por comas..." required />
            </div>
            <div className="form-group full-width">
              <label>Información sobre el Tema Principal</label>
              <textarea name="informacionTema" value={formData.informacionTema} onChange={handleInputChange} rows="3" placeholder="Describe de qué trata el tema principal..." required />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: SUBTEMAS */}
        <div className="form-section">
          <div className="section-header-flex">
            <h3 className="section-title">2. Subtemas e Imágenes</h3>
            <button type="button" className="add-btn" onClick={handleAddSubtema}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Agregar Subtema
            </button>
          </div>
          
          <div className="subtemas-list">
            {formData.subtemas.map((sub, index) => (
              <div key={sub.id} className="subtema-card">
                <div className="subtema-header">
                  <div className="subtema-number">{index + 1}</div>
                  {formData.subtemas.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => handleRemoveSubtema(sub.id)}>✕</button>
                  )}
                </div>

                <div className="subtema-content">
                  <div className="subtema-row">
                    <input type="text" placeholder="Título del subtema" value={sub.titulo} onChange={(e) => handleSubtemaChange(sub.id, "titulo", e.target.value)} required />
                    <div className="file-upload-mini">
                      <input type="file" accept="image/*" id={`img-${sub.id}`} onChange={(e) => handleSubtemaChange(sub.id, "imagen", e.target.files[0])} />
                      <label htmlFor={`img-${sub.id}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <span className="file-name">{sub.imagen ? sub.imagen.name : (sub.imagenUrl ? "Cambiar Imagen" : "Subir Imagen")}</span>
                      </label>
                    </div>
                  </div>
                  <textarea className="subtema-desc" placeholder="Descripción..." value={sub.descripcion} onChange={(e) => handleSubtemaChange(sub.id, "descripcion", e.target.value)} rows="2" required />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 3: MULTIMEDIA */}
        <div className="form-section">
          <h3 className="section-title">3. Multimedia y Enlaces</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Link de Video Webinar</label>
              <input type="url" name="linkWebinar" value={formData.linkWebinar} onChange={handleInputChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Link de Reel</label>
              <input type="url" name="linkReel" value={formData.linkReel} onChange={handleInputChange} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: ARCHIVOS */}
        <div className="form-section">
          <h3 className="section-title">4. Documentos y Fuentes</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Actividad (PDF)</label>
              <div className="dropzone">
                <input type="file" accept=".pdf" id="pdf-upload" onChange={(e) => setArchivoActividad(e.target.files[0])} />
                <label htmlFor="pdf-upload">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span className="file-name">{archivoActividad ? archivoActividad.name : (formData.urlActividadPDF ? "Cambiar PDF" : "Subir PDF")}</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Calificaciones (Excel) - <span style={{color: '#64748B', fontWeight: 'normal'}}>Opcional</span></label>
              <div className="dropzone">
                <input type="file" accept=".xlsx, .xls, .csv" id="excel-upload" onChange={(e) => setArchivoExcel(e.target.files[0])} />
                <label htmlFor="excel-upload">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>
                  <span className="file-name">{archivoExcel ? archivoExcel.name : (formData.urlCalificacionesExcel ? "Cambiar Excel" : "Subir Excel")}</span>
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Fuentes Bibliográficas</label>
              <textarea name="fuentes" value={formData.fuentes} onChange={handleInputChange} rows="3" placeholder="Escribe las fuentes consultadas..." />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? "Guardando..." : documentId ? "Actualizar Registro" : "Guardar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}