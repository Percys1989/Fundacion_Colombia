// ── DETECCIÓN DE ENTORNO (funciona en GitHub Pages Y Hostinger) ──────────
const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Fundacion_Colombia/"
  : "/";

// Detecta si estamos en la raíz (index) o en una subcarpeta (src/)
const enIndex = window.location.pathname.endsWith("Index.html")
  || window.location.pathname.endsWith("index.html")
  || window.location.pathname === BASE_PATH
  || window.location.pathname === "/";

const esDonaciones = window.location.pathname.includes("donaciones.html");

// Ruta al index y a donaciones según ubicación actual
const rutaIndex = enIndex ? "" : "../index.html";
const rutaDonaciones = enIndex ? "src/donaciones.html" : "donaciones.html";

document.addEventListener("DOMContentLoaded", () => {

  // ── CARGAR HEADER ──────────────────────────────────────────────────────
  const headerEl = document.getElementById("header");
  if (headerEl) {
    fetch(BASE_PATH + "src/header.html")
      .then(res => res.text())
      .then(data => {
        headerEl.outerHTML = data;

        // Logo
        const logo = document.querySelector(".logo-container img");
        if (logo) logo.src = BASE_PATH + "imagenes/Logo1.jpg";

        // Rellenar hrefs del nav según la página actual
        document.querySelectorAll("#navMenu [data-link]").forEach(link => {
          const seccion = link.dataset.link;
          if (seccion === "footer") {
            // Contacto: si estamos en index hace scroll, si no va al index
            link.href = enIndex ? "#footer" : rutaIndex + "#footer";
          } else {
            link.href = enIndex ? "#" + seccion : rutaIndex + "#" + seccion;
          }
        });

        // Botón Donar: ocultar si ya estamos en donaciones.html
        const donarBtn = document.getElementById("donateBtnNav");
        if (donarBtn) {
          if (esDonaciones) {
            donarBtn.style.display = "none";
          } else {
            donarBtn.href = enIndex ? "src/donaciones.html" : "donaciones.html";
          }
        }

        activarMenu();
      })
      .catch(err => console.error("Error al cargar el header:", err));
  }

  // ── CARGAR FOOTER ──────────────────────────────────────────────────────
  const footerEl = document.getElementById("footer");
  if (footerEl) {
    fetch(BASE_PATH + "src/footer.html")
      .then(res => res.text())
      .then(data => {
        footerEl.outerHTML = data;
      })
      .catch(err => console.error("Error al cargar el footer:", err));
  }
});

// ── INTERCEPTAR CLICKS EN data-link (scroll suave en index) ──────────────
document.addEventListener("click", function (e) {
  const link = e.target.closest("[data-link]");
  if (!link) return;

  const seccion = link.dataset.link;
  const target = document.getElementById(seccion);

  // Si la sección existe en esta página, hacer scroll suave
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  }
  // Si no existe, deja que el href navegue normalmente al index con ancla
});

// ── SLIDER HERO ──────────────────────────────────────────────────────────
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

// ── MODAL PUBLICIDAD (una vez por sesión) ─────────────────────────────────
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

// ── SCROLL ────────────────────────────────────────────────────────────────
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
  if (topBtn) topBtn.style.display = document.documentElement.scrollTop > 300 ? "flex" : "none";
  updateHeader();
  checkSections();
});

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ── HEADER SCROLL ─────────────────────────────────────────────────────────
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

// ── MENÚ HAMBURGUESA ──────────────────────────────────────────────────────
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

// ── ANIMACIONES DE SCROLL ─────────────────────────────────────────────────
function checkSections() {
  const trigger = window.innerHeight * 0.85;
  document.querySelectorAll('.info-split').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    const visible = rect.top < trigger && rect.bottom > 100;
    sec.classList.toggle('active', visible);
  });
}
checkSections();

// ── SLIDER DE VALORES ─────────────────────────────────────────────────────
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

// ── BOTONES DE MONTO ──────────────────────────────────────────────────────
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

// ── FORMULARIO DONACIÓN ───────────────────────────────────────────────────
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

// ── PESTAÑAS ACTIVIDADES ────
window.cambiarTab = function (btnClickeado, panelId) {
  const evento = btnClickeado.closest('.event');
  evento.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  evento.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btnClickeado.classList.add('active');
  document.getElementById(panelId).classList.add('active');
};

function setPanel(n) {
    const panel = document.getElementById('panel' + n);
    if (!panel) return;

    document.querySelectorAll('.don-panel').forEach(p => p.classList.remove('active'));
    panel.classList.add('active');

    document.querySelectorAll('.don-step').forEach((s, i) => {
        s.classList.toggle('active', i < n);
        s.classList.toggle('done', i < n - 1);
    });

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const porcentaje = { 1: 33, 2: 66, 3: 100 };
        progressFill.style.width = porcentaje[n] + '%';
    }

    // ✅ Solo hace scroll si estamos en donaciones.html
    if (esDonaciones) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ---detectar imagenes dominantes para adaptar colores---
function getDominantColor(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let r = 0, g = 0, b = 0, count = 0;

  // 🔥 Tomamos muestras (no todos los píxeles para optimizar)
  for (let i = 0; i < data.length; i += 40) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  return `rgb(${r}, ${g}, ${b})`;
}
window.addEventListener("load", () => {
  const img = document.getElementById("heroImg");
  const hero = document.querySelector(".hero");

  if (!img || !hero) return;

  // Esperar a que cargue la imagen
  if (img.complete) {
    aplicarColor();
  } else {
    img.onload = aplicarColor;
  }

  function aplicarColor() {
    const color = getDominantColor(img);

    hero.style.background = `
      linear-gradient(90deg, 
        ${color} 0%, 
        #0D47A1 50%, 
        ${color} 100%)
    `;
  }
});

// ── FORMULARIO VOLUNTARIADO ───────────────
function toggleDia(btn) {
  btn.classList.toggle('active');
}

async function enviarVoluntario() {
  const nombre = document.getElementById('volNombre').value.trim();
  const apellido = document.getElementById('volApellido').value.trim();
  const correo = document.getElementById('volCorreo').value.trim();
  const celular = document.getElementById('volCelular').value.trim();
  const actividad = document.getElementById('volActividad').value;

  if (!nombre) { volToast('Por favor escribe tu nombre.'); return; }
  if (!apellido) { volToast('Por favor escribe tu apellido.'); return; }
  if (!correo || !correo.includes('@')) { volToast('Por favor escribe un correo válido.'); return; }
  if (!celular || celular.length < 7) { volToast('Por favor escribe tu celular.'); return; }
  if (!actividad) { volToast('Por favor selecciona una actividad.'); return; }

  const dias = [...document.querySelectorAll('.vol-dia-btn.active')]
    .map(b => b.textContent.trim()).join(', ');
  if (!dias) { volToast('Por favor selecciona al menos un día disponible.'); return; }

  const motivacion = document.getElementById('volMotivacion').value.trim();

  const SHEETS_URL_VOL = "https://script.google.com/macros/s/AKfycbxDqBabJmgoB9ewHADnOU4Jc_o35ttWHJLghtH04ETL2KO_Zbdv7aLk4_INMVvcdBPJuw/exec";

  const params = new URLSearchParams({
    nombre: nombre + ' ' + apellido,
    correo, celular, actividad,
    disponibilidad: dias,
    motivacion
  });

  await fetch(SHEETS_URL_VOL + '?' + params.toString(), {
    method: 'GET', mode: 'no-cors'
  });

  document.getElementById('formVoluntario').style.display = 'none';
  document.getElementById('volExito').style.display = 'block';

  // ✅ Scroll suave al mensaje de éxito, NO al top de la página
  document.getElementById('volExito').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
  document.getElementById('volNombre').value = '';
  document.getElementById('volApellido').value = '';
  document.getElementById('volCorreo').value = '';
  document.getElementById('volCelular').value = '';
  document.getElementById('volActividad').value = '';
  document.getElementById('volMotivacion').value = '';
  document.querySelectorAll('.vol-dia-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('formVoluntario').style.display = 'block';
  document.getElementById('volExito').style.display = 'none';
}

function volToast(msg) {
  const t = document.createElement('div');
  t.className = 'don-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}