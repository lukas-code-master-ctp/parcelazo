# Parcelazo Diecio$0 — Compra Tu Parcela

Landing de campaña para la venta online de Fiestas Patrias: parcelas con **Pie $0** y **cuotas desde $234.000** en los cinco proyectos de Compra Tu Parcela.

Sitio estático, sin build ni dependencias. Se publica tal cual en GitHub Pages.

---

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La landing completa: hero, contador, proyectos, calculadora, newsletter y WhatsApp |
| `terminos.html` | Términos y Condiciones de la promoción |
| `assets/` | Escudo de campaña, logo, favicons y fotos de los proyectos, ya optimizados |
| `.nojekyll` | Le dice a GitHub Pages que sirva los archivos sin procesarlos con Jekyll |

---

## Qué hay que completar antes de publicar

### 1. Configuración de la landing

Todo está en el objeto `CONFIG`, al inicio del `<script>` de `index.html`:

```js
const CONFIG = {
  inicioVenta:        '2026-09-18T09:00:00-03:00',  // PENDIENTE: fecha real de apertura
  cierreVenta:        '2026-09-21T23:59:00-03:00',  // PENDIENTE: null si no aplica
  whatsappGrupo:      'https://chat.whatsapp.com/H2VMUCJoOCtFBfy2UIPvth',  // listo
  newsletterEndpoint: '',                           // PENDIENTE: URL del proveedor de email
  proyectos: [ /* precios cargados, ver más abajo */ ],
  plazoMaximo: 120                                  // PENDIENTE: plazo real
};
```

### Estado de los datos

| Dato | Estado |
|---|---|
| Precios «desde» de los 5 proyectos | Cargados |
| Link del grupo de WhatsApp | Cargado |
| **Plazo máximo de financiamiento** | **Pendiente** — hoy está en 120 cuotas |
| Fechas de inicio y cierre | Pendientes |
| Endpoint del newsletter | Pendiente |
| Superficies (5.000 m²) | Supuesto, sin confirmar |
| Comunas de Don Danilo y Don Guillermo | Sin confirmar |

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
  img:       'vive-longavi',                  // nombre base en assets/, sin extension (null si no hay foto)
  destacado: 'El más conveniente'             // texto del sticker, o null
}
```

La cuota de cada tarjeta se calcula sola: `precio ÷ plazoMaximo`, redondeando **hacia arriba** para que la publicidad nunca prometa una cuota menor que la real.

El titular del hero y el letrero deslizante también se calculan solos, a partir del proyecto más barato:

```js
const cuotaMinima = () => Math.min(...CONFIG.proyectos.map(p => p.precio)) / CONFIG.plazoMaximo;
```

Así que **basta cambiar `plazoMaximo` para que toda la página se actualice**, sin cifras escritas a mano en ningún lado.

> Con los precios actuales y 120 cuotas, el «desde» queda en **$66.584** (Don Guillermo). El «$234.000» del brief original no corresponde a estos precios en ningún plazo redondo: harían falta 34,1 cuotas.

Los precios cargados son valores **«desde»** por proyecto:

| Proyecto | Precio desde |
|---|---|
| Don Guillermo | $7.990.000 |
| Praderas de Cauquenes | $8.990.000 |
| Jardines de Litueche | $12.990.000 |
| Vive Longaví | $13.500.000 |
| Hacienda Don Danilo | $14.990.000 |

### 3. Imágenes

Ya están cargadas y optimizadas en `assets/`, generadas desde la carpeta `Material/` (que no se sube al repo por peso: ~350 MB de RAW y planos).

| Proyecto | Estado |
|---|---|
| Vive Longaví | Listo — `vive-longavi.webp/.jpg` (desde `DJI_0016.DNG`) |
| Praderas de Cauquenes | Listo — `praderas-cauquenes.webp/.jpg` |
| Jardines de Litueche | Listo — `jardines-litueche.webp/.jpg` |
| **Hacienda Don Danilo** | **Falta foto** — la carpeta del material venía vacía |
| **Don Guillermo** | **Falta foto** — la carpeta del material venía vacía |

Los dos últimos muestran un marcador rayado que dice «Falta foto». Para agregarlas:

1. Deja la foto en `assets/` como `hacienda-don-danilo.jpg` + `.webp` (1200 × 750, recorte 16:10)
2. En `CONFIG.proyectos`, cambia `img:null` por `img:'hacienda-don-danilo'`

> El campo `img` es el **nombre base sin extensión**. La página sirve el `.webp` y usa el `.jpg` como respaldo.

Otros assets ya resueltos: escudo del hero (`escudo-parcelazo`), letrero del logo (`logo-compratuparcela`), favicons (`favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icono-512.png`) e imagen para redes (`og-parcelazo.jpg`).

### 4. Términos y Condiciones

`terminos.html` es un **borrador que debe revisar el abogado antes de publicarse**. Todos los datos por completar están marcados con fondo rayado y borde rojo (clase `.pl`), así que se ven a simple vista al abrir la página.

Para encontrarlos todos:

```bash
grep -o 'class="pl">\[[^]]*\]' terminos.html
```

---

## Publicar en GitHub Pages

```bash
git add -A && git commit -m "Actualiza la landing"
```

```bash
git push
```

El repositorio ya está en https://github.com/lukas-code-master-ctp/parcelazo

Para publicar el sitio: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`**.
Queda en `https://lukas-code-master-ctp.github.io/parcelazo/` en un par de minutos.

> No lo actives hasta cerrar el plazo de financiamiento, las fechas y la revisión legal de los Términos.

### Dominio propio

Para servirlo desde un subdominio de compratuparcela.cl:

1. Crea un archivo `CNAME` en la raíz del repo con una sola línea: `dieciocho.compratuparcela.cl`
2. En el DNS del dominio, agrega un registro `CNAME` de `dieciocho` apuntando a `lukas-code-master-ctp.github.io`
3. En **Settings → Pages**, escribe el dominio y activa **Enforce HTTPS**

Todas las rutas del sitio son relativas, así que funciona igual en `lukas-code-master-ctp.github.io/parcelazo/` que en un dominio propio.

---

## Notas técnicas

- Un solo archivo por página, CSS y JS embebidos. La única dependencia externa es Google Fonts (Alfa Slab One, Rye, Barlow, Barlow Condensed).
- Las imágenes se sirven en WebP con respaldo JPG/PNG vía `<picture>`. Total de `assets/`: ~1,8 MB.
- Las fotos de las tarjetas usan `loading="lazy"`; el escudo del hero usa `fetchpriority="high"`.
- La calculadora simula `(precio − pie) ÷ cuotas`, sin interés ni reajuste. Si el financiamiento real lleva interés o reajuste en UF, hay que cambiar la función `calcular()` y también la cláusula 11 de los Términos.
- Respeta `prefers-reduced-motion`: con esa preferencia activada se desactivan todas las animaciones.
- El contador usa hora de Chile (`-03:00`) codificada en la fecha, así que muestra lo mismo sin importar la zona horaria del visitante.
- `terminos.html` tiene hoja de estilos de impresión: se puede exportar a PDF desde el navegador sin el nav ni el índice.
