import TemaDetalle from "./TemaDetalle";

const tema = {
  unidad: 1,
  titulo: "Teoría de las Necesidades",
  descripcion:
    "En este tema abordaremos lass cinco teorías de la motivación humana y explicamos cómo influyen las necesidades, los estímulos y las condiciones laborales en el comportamiento de los trabajadores.",

  subtemas: [
    { titulo: "Teoría del Condicionamiento Operante – B. F. Skinner", texto: "Explica cómo las recompensas y los castigos influyen en el comportamiento de las personas. Las conductas que reciben refuerzos positivos tienden a repetirse." },
    { titulo: "Teoría de la Jerarquía de Necesidades – Abraham Maslow", texto: "Propone que las necesidades humanas se organizan en una jerarquía de cinco niveles: necesidades fisiológicas, seguridad, pertenencia y amor, estima, y autorrealización." },
    { titulo: "Teoría de la Afectividad – David McClelland", texto: "Enfatiza la importancia de las necesidades de logro, poder y affiliación en la motivación humana." },
    { titulo: "Teoría del Desarrollo Humano – Carl Rogers", texto: "Sostiene que el crecimiento personal y la auto-realización son los objetivos principales del ser humano." },
    { titulo: "Teoría de la Expectativa – Victor Vroom", texto: "Argumenta que la motivación depende de la expectativa de que el esfuerzo conduzca a un desempeño determinado, y que este desempeño conduzca a una recompensa deseada." },
    { titulo: "Teoría del Refuerzo Social – Albert Bandura", texto: "Destaca el papel del aprendizaje social y la observación en la formación del comportamiento humano." },
  ],

  imagenes: [
    // { src: "/temas/necesidades/img1.jpg", alt: "Descripción" },
  ],

  webinar: "https://youtu.be/GGlE37bSdCg",
  reel: "https://youtube.com/shorts/w54sgXuBik8",

  actividad: { titulo: "", descripcion: "" },
  calificaciones: "",
  fuentes: [],

  integrantes: ["Mtro. Fernández Hernández Luis Manuel"],
};

function TeoriaNecesidades() {
  return <TemaDetalle tema={tema} numeroTema={1} />;
}

export default TeoriaNecesidades;