document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  // Entrada suave de las tarjetas al aparecer en pantalla
  const elementos = document.querySelectorAll(".aparece");
  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observador.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    elementos.forEach((el) => observador.observe(el));
  } else {
    elementos.forEach((el) => el.classList.add("visible"));
  }

  // Columna izquierda fija: si no cabe en la pantalla, baja con la página hasta verse completa
  const perfil = document.querySelector(".perfil");
  const ajustarPerfil = () => {
    if (window.matchMedia("(max-width: 860px)").matches) { perfil.style.top = ""; return; }
    perfil.style.top = Math.min(0, window.innerHeight - perfil.offsetHeight) + "px";
  };
  window.addEventListener("resize", ajustarPerfil);
  ajustarPerfil();

  // Índice: resalta la sección que se está viendo
  const enlaces = [...document.querySelectorAll(".indice a")];
  const secciones = enlaces.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const marcar = () => {
    const limite = window.innerHeight * 0.35;
    let actual = secciones[0];
    secciones.forEach((s) => { if (s.getBoundingClientRect().top <= limite) actual = s; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) actual = secciones[secciones.length - 1];
    enlaces.forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === "#" + actual.id));
  };
  window.addEventListener("scroll", marcar, { passive: true });
  marcar();

  // Visor para ampliar las capturas
  const visor = document.querySelector(".visor");
  const imagenVisor = visor.querySelector("img");
  document.querySelectorAll("[data-ampliar]").forEach((boton) => {
    boton.addEventListener("click", () => {
      imagenVisor.src = boton.dataset.ampliar;
      imagenVisor.alt = boton.querySelector("img").alt;
      if (typeof visor.showModal === "function") visor.showModal();
      else window.open(boton.dataset.ampliar, "_blank");
    });
  });
  visor.querySelector(".visor__cerrar").addEventListener("click", () => visor.close());
  visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
});
