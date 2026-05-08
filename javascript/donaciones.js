
// ══════════════════════════════════════════════════════
//  ✏️  PEGA AQUÍ LA URL DE TU GOOGLE APPS SCRIPT
//  (la obtienes en Extensiones → Apps Script → Implementar)
// ══════════════════════════════════════════════════════
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyIXTnHoln60ygUcK8qmuwGuzRBFm8RuwhKRAWpeiXeP02bzTAKEgGMiXFI4CPS0kYTNg/exec";
// ── PARTÍCULAS HERO ──
const cv = document.getElementById('heroCanvas');
if (cv) {
    const ctx = cv.getContext('2d');

    function resizeCanvas() {
        cv.width = cv.offsetWidth;
        cv.height = cv.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        c: Math.random() > 0.5 ? '#FFC107' : '#ffffff'
    }));

    function drawParticles() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.c;
            ctx.globalAlpha = 0.6;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > cv.width) p.dx *= -1;
            if (p.y < 0 || p.y > cv.height) p.dy *= -1;
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

// Estado global de la donación
let donacion = {
    nombre: '', correo: '', celular: '',
    tipo: '', monto: '', metodo: ''
};

// ── Seleccionar tipo (Diezmo / Ofrenda) ──
function selTipo(btn) {
    document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    donacion.tipo = btn.dataset.tipo;
}

// ── Seleccionar monto ──
function selMonto(btn) {
    document.querySelectorAll('.monto-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const inp = document.getElementById('montoPersonalizado');
    if (btn.dataset.value === 'otro') {
        inp.style.display = 'block';
        inp.focus();
        donacion.monto = '';
    } else {
        inp.style.display = 'none';
        inp.value = '';
        donacion.monto = btn.dataset.value;
    }
}

// ── Ir al paso 2 con validación ──
function irPaso2() {
    const nombre = document.getElementById('inputNombre').value.trim();
    const correo = document.getElementById('inputCorreo').value.trim();
    const celular = document.getElementById('inputCelular').value.trim();
    const montoP = document.getElementById('montoPersonalizado').value;

    if (!nombre) { toast('Por favor escribe tu nombre completo.'); return; }
    if (!correo || !correo.includes('@')) { toast('Por favor escribe un correo válido.'); return; }
    if (!celular || celular.length < 7) { toast('Por favor escribe tu número de celular.'); return; }
    if (!donacion.tipo) { toast('Por favor selecciona si es Diezmo u Ofrenda.'); return; }
    if (!donacion.monto) {
        if (!montoP || Number(montoP) < 1000) {
            toast('Por favor escribe un monto válido (mínimo $1.000).');
            return;
        }
        donacion.monto = montoP;
    }

    donacion.nombre = nombre;
    donacion.correo = correo;
    donacion.celular = celular;
    setPanel(2);
}

// ── Seleccionar método de pago ──
function selMetodo(metodo) {
    document.querySelectorAll('.metodo-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.metodo-info').forEach(i => i.classList.remove('show'));
    document.getElementById('card' + metodo).classList.add('active');
    document.getElementById('info' + metodo).classList.add('show');
    donacion.metodo = metodo;

    if (metodo === 'PSE') {
        // PSE no necesita referencia manual
        document.getElementById('campoReferencia').style.display = 'none';
        document.getElementById('inputReferencia').value = 'PSE-MiPagoAmigo';
    } else {
        document.getElementById('campoReferencia').style.display = 'block';
        document.getElementById('inputReferencia').value = '';
    }
    document.getElementById('btnConfirmar').disabled = false;
}

// ── Ir al paso 3 ──
async function irPaso3() {
    if (!donacion.metodo) { toast('Por favor selecciona un método de pago.'); return; }

    // PSE no requiere referencia manual
    if (donacion.metodo !== 'PSE') {
        const referencia = document.getElementById('inputReferencia').value.trim();
        if (!referencia) {
            toast('Por favor ingresa el número de referencia de tu transacción.');
            document.getElementById('inputReferencia').focus();
            return;
        }
        donacion.referencia = referencia;
    } else {
        donacion.referencia = 'Pago vía Mi Pago Amigo';
    }

    const btnConfirmar = document.getElementById('btnConfirmar');
    const textoOriginal = btnConfirmar.innerHTML;
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = 'Validando donación...';

    try {
        await enviarASheets();
    } catch (error) {
        console.error('Error al registrar la donación:', error);
        toast('No pudimos confirmar tu donación. Inténtalo nuevamente en unos segundos.');
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = textoOriginal;
        return;
    }

    // ✅ Si eligió PSE abre Mi Pago Amigo en nueva pestaña
    if (donacion.metodo === 'PSE') {
        window.open('https://www.mipagoamigo.com/MPA_WebSite/ServicePayments', '_blank');
    }

    const fmt = n => Number(n).toLocaleString('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    });

    document.getElementById('graciasTexto').textContent =
        `${donacion.nombre}, tu ${donacion.tipo.toLowerCase()} de ${fmt(donacion.monto)} ha sido registrada.`;

    document.getElementById('resumenDonacion').innerHTML = `
        <div class="resumen-fila"><span>Nombre</span>     <strong>${donacion.nombre}</strong></div>
        <div class="resumen-fila"><span>Correo</span>     <strong>${donacion.correo}</strong></div>
        <div class="resumen-fila"><span>Celular</span>    <strong>${donacion.celular}</strong></div>
        <div class="resumen-fila"><span>Tipo</span>       <strong>${donacion.tipo}</strong></div>
        <div class="resumen-fila"><span>Monto</span>      <strong>${fmt(donacion.monto)}</strong></div>
        <div class="resumen-fila"><span>Método</span>     <strong>${donacion.metodo === 'PSE' ? 'PSE / Mi Pago Amigo' : donacion.metodo}</strong></div>
        <div class="resumen-fila"><span>Referencia</span> <strong>${donacion.referencia}</strong></div>
    `;

    // Mensaje diferente para PSE
    if (donacion.metodo === 'PSE') {
        document.querySelector('#panel3 .gracias-icon').textContent = '⏳';
        document.querySelector('#panel3 h2').textContent = '¡Ya casi terminas!';
        document.querySelector('#panel3 .gracias-nota').innerHTML =
            'Completa tu pago en la ventana de <strong>Mi Pago Amigo</strong> que se acaba de abrir. Si no se abrió, <a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments" target="_blank" style="color:#0D47A1; font-weight:600;">haz clic aquí</a>. ❤️';
    } else {
        document.querySelector('#panel3 .gracias-icon').textContent = '🙏';
        document.querySelector('#panel3 h2').textContent = '¡Gracias por tu generosidad!';
        document.querySelector('#panel3 .gracias-nota').innerHTML =
            'Hemos registrado tu donación exitosamente. La Fundación Colombia Familias Resilientes te lo agradece de corazón. ¡Que Dios te bendiga! ❤️';
    }

    setPanel(3);
}

// ── Volver al paso 1 ──
function irPaso1() {
    setPanel(1);
    donacion.metodo = '';
    donacion.referencia = '';
    document.getElementById('btnConfirmar').disabled = true;
    document.getElementById('campoReferencia').style.display = 'none';
    document.getElementById('inputReferencia').value = '';
    document.querySelectorAll('.metodo-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.metodo-info').forEach(i => i.classList.remove('show'));
}

// ── Cambiar panel activo ──
function setPanel(n) {
    document.querySelectorAll('.don-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel' + n).classList.add('active');
    document.querySelectorAll('.don-step').forEach((s, i) => {
        s.classList.toggle('active', i < n);
        s.classList.toggle('done', i < n - 1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Enviar a Google Sheets vía GET (método confirmado que funciona) ──
async function enviarASheets() {
    const params = new URLSearchParams({
        nombre: donacion.nombre,
        correo: donacion.correo,
        celular: donacion.celular,
        tipo: donacion.tipo,
        monto: donacion.monto,
        metodo: donacion.metodo,
        referencia: donacion.referencia || ''
    });

    await fetch(SHEETS_URL + '?' + params.toString(), {
        method: 'GET',
        mode: 'no-cors'
    });
    // no-cors devuelve una "opaque response" — no podemos leer
    // el body, pero si llegamos aquí sin excepción, la petición
    // salió bien ✅
}

// ── Copiar al portapapeles ──
function copiar(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => toast('✓ Copiado: ' + texto, true));
}

// ── Toast de notificación ──
function toast(msg, exito = false) {
    const t = document.createElement('div');
    t.className = 'don-toast' + (exito ? ' exito' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
    }, 3000);
}