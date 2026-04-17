document.addEventListener("DOMContentLoaded", () => {
  // ── BASE GLOBAL ───────────────────────────────────────────
  const BASE_PATH = window.location.hostname.includes("github.io")
    ? "/Fundacion_Colombia/"
    : "/";
  // ── CARGAR HEADER ────────────────────────────────────────
  fetch(BASE_PATH + "src/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });
  // LOGO
  const logo = document.querySelector(".logo-container img");
  if (logo) { logo.src = BASE_PATH + "imagenes/Logo.png"; }

  // BOTÓN DONAR
  document.querySelectorAll(".donate-btn").forEach(btn => {
    btn.href = BASE_PATH + "src/donaciones.html";
  });
  activarMenu();
});

// ── CARGAR FOOTER ────────────────────────────────────────
fetch(BASE_PATH + "src/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

// ── INTERCEPTAR BOTÓN DONAR (fuera del nav) ──────────────
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".donate-btn");
  if (btn && !btn.closest("#navMenu")) {
    e.preventDefault();
    window.location.href = BASE_PATH + "src/donaciones.html";
  }
});

document.addEventListener("click", function (e) {
  const link = e.target.closest("[data-link]");

  if (link) {
    e.preventDefault();
    const section = link.dataset.link;
    window.location.href = BASE_PATH + "#" + section;
  }
});

// ── SLIDER HERO ──────────────────────────────────────────
let index = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

if (slides.length) {
  function showSlide(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[i].classList.add('active');
    if (dots[i]) dots[i].classList.add('active');
  }

  const nextSlide = () => { index = (index + 1) % slides.length; showSlide(index); };
  const prevSlide = () => { index = (index - 1 + slides.length) % slides.length; showSlide(index); };

  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);
  dots.forEach((dot, i) => dot.addEventListener('click', () => { index = i; showSlide(index); }));

  let autoSlide = setInterval(nextSlide, 4000);
  const sliderEl = document.querySelector('.slider');
  sliderEl?.addEventListener('mouseenter', () => clearInterval(autoSlide));
  sliderEl?.addEventListener('mouseleave', () => { autoSlide = setInterval(nextSlide, 4000); });
}

// ── MODAL PUBLICIDAD (una vez por sesión) ────────────────
const modal = document.getElementById("modal");
const cerrarBtn = document.getElementById("cerrarModal");

if (modal && !sessionStorage.getItem("modalVisto")) {
  setTimeout(() => {
    modal.style.display = "flex";
    sessionStorage.setItem("modalVisto", "true");
  }, 800);
}

const closeModal = () => { if (modal) modal.style.display = "none"; };
cerrarBtn?.addEventListener("click", closeModal);
modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });

// ── SCROLL ───────────────────────────────────────────────
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
  if (topBtn) topBtn.style.display = document.documentElement.scrollTop > 300 ? "flex" : "none";
  updateHeader();
  checkSections();
});

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ── HEADER SCROLL (respeta menú abierto) ─────────────────
function updateHeader() {
  const header = document.querySelector("header");
  const navMenu = document.getElementById("navMenu");
  if (!header) return;
  if (navMenu?.classList.contains("active")) {
    header.classList.remove("scrolled");
  } else if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// ── MENÚ HAMBURGUESA ─────────────────────────────────────
function activarMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("menuOverlay");

  menuToggle?.addEventListener("click", () => {
    navMenu?.classList.toggle("active");
    const icon = menuToggle.querySelector("i");
    icon?.classList.toggle("fa-bars");
    icon?.classList.toggle("fa-times");
    updateHeader();
  });

  overlay?.addEventListener("click", () => {
    navMenu?.classList.remove("active");
    overlay?.classList.remove("active");
    const icon = menuToggle?.querySelector("i");
    icon?.classList.remove("fa-times");
    icon?.classList.add("fa-bars");
    updateHeader();
  });

  document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("active");
      overlay?.classList.remove("active");
      const icon = menuToggle?.querySelector("i");
      icon?.classList.remove("fa-times");
      icon?.classList.add("fa-bars");
      updateHeader();
    });
  });
}

// ── ANIMACIONES DE SCROLL (info-split) ───────────────────
function checkSections() {
  const trigger = window.innerHeight * 0.85;
  document.querySelectorAll('.info-split').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    const visible = rect.top < trigger && rect.bottom > 100;
    sec.classList.toggle('active', visible);
  });
}
checkSections();

// ── SLIDER DE VALORES ────────────────────────────────────
const valores = [
  { nombre: 'Amor', icono: '❤️', desc: 'Servimos con un corazón dispuesto, siendo instrumentos de esperanza y reflejando el valor de cada persona.' },
  { nombre: 'Solidaridad', icono: '🤝', desc: 'Nos comprometemos con las necesidades de los demás, actuando con generosidad y sentido humano.' },
  { nombre: 'Compromiso', icono: '⭐', desc: 'Trabajamos con responsabilidad, constancia y pasión por el bienestar de las comunidades.' },
  { nombre: 'Empatía', icono: '💙', desc: 'Escuchamos, entendemos y actuamos frente a las realidades de quienes más lo necesitan.' },
  { nombre: 'Esperanza', icono: '🌟', desc: 'Creemos en un futuro mejor y sembramos fe en cada acción que realizamos.' },
  { nombre: 'Resiliencia', icono: '💪', desc: 'Promovemos la capacidad de levantarse, avanzar y transformar las dificultades en oportunidades.' },
  { nombre: 'Integridad', icono: '🛡️', desc: 'Actuamos con transparencia, honestidad y coherencia en cada proceso y decisión.' },
  { nombre: 'Generosidad', icono: '🎁', desc: 'Damos con alegría, compartiendo recursos, tiempo y amor para impactar vidas.' },
];

const track = document.getElementById('valoresTrack');
if (track) {
  [...valores, ...valores].forEach(v => {
    const card = document.createElement('div');
    card.className = 'valor-card';
    card.innerHTML = `
        <div class="valor-icon">${v.icono}</div>
        <h3>${v.nombre}</h3>
        <p>${v.desc}</p>
      `;
    track.appendChild(card);
  });
}

// ── BOTONES DE MONTO ─────────────────────────────────────
const montoBtns = document.querySelectorAll(".monto-btn");
const montoInput = document.getElementById("montoInput");

montoBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    montoBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (btn.dataset.value === "otro") {
      if (montoInput) { montoInput.style.display = "block"; montoInput.focus(); }
    } else {
      if (montoInput) { montoInput.style.display = "none"; montoInput.value = ""; }
    }
  });
});

// ── FORMULARIO DONACIÓN ──────────────────────────────────
const formDonacion = document.getElementById("formDonacion");
if (formDonacion) {
  formDonacion.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = formDonacion.querySelector('input[type="text"]').value.trim();
    const correo = formDonacion.querySelector('input[type="email"]').value.trim();
    const metodo = formDonacion.querySelector('select').value;
    const montoBtn = formDonacion.querySelector('.monto-btn.active');
    const monto = montoBtn?.dataset.value === "otro" ? montoInput?.value : montoBtn?.dataset.value;

    if (!nombre || !correo || !metodo || !monto) {
      alert("Por favor completa todos los campos antes de continuar.");
      return;
    }

    // Resaltar la tarjeta del método elegido
    const metodoMap = { "Transferencia": 0, "QR": 1, "PSE": 2 };
    const cards = document.querySelectorAll('.donacion-card');
    cards.forEach(c => c.style.border = "2px solid transparent");
    const idx = metodoMap[metodo];
    if (cards[idx] !== undefined) {
      cards[idx].style.border = "3px solid #00d4ff";
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    document.getElementById("mensajeExito").style.display = "block";
  });
}

// ── PESTAÑAS ACTIVIDADES ─────────────────────────────────
window.cambiarTab = function (btnClickeado, panelId) {
  const evento = btnClickeado.closest('.event');
  evento.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  evento.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btnClickeado.classList.add('active');
  document.getElementById(panelId).classList.add('active');
};