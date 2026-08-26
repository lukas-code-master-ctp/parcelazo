# Venta Dieciochera Pie $0 — Compra Tu Parcela

Landing de campaña para la venta online de Fiestas Patrias: parcelas con **Pie $0** y **cuotas desde $234.000** en los cinco proyectos de Compra Tu Parcela.

Sitio estático, sin build ni dependencias. Se publica tal cual en GitHub Pages.

---

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa: hero, contador, proyectos, calculadora, newsletter y WhatsApp |
| `terminos.html` | Términos y Condiciones de la promoción |
| `assets/` | Imágenes de los proyectos y de redes sociales |
| `.nojekyll` | Le dice a GitHub Pages que sirva los archivos sin procesarlos con Jekyll |

---

## Qué hay que completar antes de publicar

### 1. Configuración de la landing

Todo está en el objeto `CONFIG`, al inicio del `<script>` de `index.html`:

```js
const CONFIG = {
  inicioVenta:        '2026-09-18T09:00:00-03:00',  // fecha real de apertura
  cierreVenta:        '2026-09-21T23:59:00-03:00',  // null si no aplica
  whatsappGrupo:      'https://chat.whatsapp.com/...', // link de invitación real
  newsletterEndpoint: '',                           // URL del proveedor de email
  proyectos: [ /* ver más abajo */ ],
  plazoMaximo: 120
};
```

- **`inicioVenta` / `cierreVenta`** — cuando llega `inicioVenta`, el contador se da vuelta solo y empieza a descontar hacia `cierreVenta` con el texto «¡Venta en vivo!». Al pasar `cierreVenta` muestra el mensaje de campaña terminada.
- **`whatsappGrupo`** — alimenta los 5 botones de WhatsApp de la página de una sola vez.
- **`newsletterEndpoint`** — si queda vacío, el formulario valida y muestra el mensaje de éxito, pero solo escribe en la consola. Al pegar la URL del proveedor, hace `POST` con JSON:
  ```json
  { "nombre": "", "email": "", "telefono": "", "proyecto": "", "origen": "landing-venta-dieciochera" }
  ```

### 2. Datos de los proyectos

Cada proyecto en `CONFIG.proyectos` alimenta a la vez la tarjeta de la grilla, el selector de la calculadora y el selector del newsletter:

```js
{
  id:        'longavi',                       // slug interno, sin espacios ni tildes
  nombre:    'Vive Longaví',
  comuna:    'Longaví, Región del Maule',
  m2:        5000,                            // número, sin puntos
  precio:    28080000,                        // pesos, número entero sin puntos ni símbolo
  img:       'assets/vive-longavi.jpg',
  destacado: 'El más conveniente'             // texto del sticker, o null
}
```

La cuota que aparece en cada tarjeta se calcula sola: `precio ÷ plazoMaximo`.

> **Ojo:** el titular de la landing dice «cuotas desde $234.000». Al cargar precios reales, verifica que la cuota más baja de todos los proyectos siga dando esa cifra, o cambia el titular.

### 3. Imágenes

Reemplaza los placeholders rayados por fotos reales. Cada uno tiene al lado un comentario HTML con el `<img>` de reemplazo.

| Archivo esperado | Tamaño sugerido | Dónde se usa |
|---|---|---|
| `assets/vive-longavi.jpg` | 1200 × 750 | Tarjeta del proyecto |
| `assets/praderas-cauquenes.jpg` | 1200 × 750 | Tarjeta del proyecto |
| `assets/hacienda-don-danilo.jpg` | 1200 × 750 | Tarjeta del proyecto |
| `assets/don-guillermo.jpg` | 1200 × 750 | Tarjeta del proyecto |
| `assets/jardines-litueche.jpg` | 1200 × 750 | Tarjeta del proyecto |
| `assets/og-venta-dieciochera.jpg` | 1200 × 630 | Vista previa al compartir en redes |

También hay que cambiar el isotipo: es el `<svg>` de estrella dentro de `.logo__mark`, aparece en el nav y en el footer de ambas páginas.

### 4. Términos y Condiciones

`terminos.html` es un **borrador que debe revisar el abogado antes de publicarse**. Todos los datos por completar están marcados con fondo rayado y borde rojo (clase `.pl`), así que se ven a simple vista al abrir la página.

Para encontrarlos todos:

```bash
grep -o 'class="pl">\[[^]]*\]' terminos.html
```

---

## Publicar en GitHub Pages

```bash
git add -A && git commit -m "Landing Venta Dieciochera Pie $0"
```

Crea el repositorio en GitHub y súbelo:

```bash
git remote add origin https://github.com/USUARIO/REPO.git && git branch -M main && git push -u origin main
```

Luego, en el repo: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`**.

Queda publicado en `https://USUARIO.github.io/REPO/` en un par de minutos.

### Dominio propio

Para servirlo desde un subdominio de compratuparcela.cl:

1. Crea un archivo `CNAME` en la raíz del repo con una sola línea: `dieciocho.compratuparcela.cl`
2. En el DNS del dominio, agrega un registro `CNAME` de `dieciocho` apuntando a `USUARIO.github.io`
3. En **Settings → Pages**, escribe el dominio y activa **Enforce HTTPS**

Todas las rutas del sitio son relativas, así que funciona igual en `usuario.github.io/repo/` que en un dominio propio.

---

## Notas técnicas

- Un solo archivo por página, CSS y JS embebidos. La única dependencia externa es Google Fonts (Alfa Slab One, Rye, Barlow, Barlow Condensed).
- La calculadora simula `(precio − pie) ÷ cuotas`, sin interés ni reajuste. Si el financiamiento real lleva interés o reajuste en UF, hay que cambiar la función `calcular()` y también la cláusula 11 de los Términos.
- Respeta `prefers-reduced-motion`: con esa preferencia activada se desactivan todas las animaciones.
- El contador usa hora de Chile (`-03:00`) codificada en la fecha, así que muestra lo mismo sin importar la zona horaria del visitante.
- `terminos.html` tiene hoja de estilos de impresión: se puede exportar a PDF desde el navegador sin el nav ni el índice.
