# Parcelazo Diecio$0 — Compra Tu Parcela

Landing de campaña para la venta online de Fiestas Patrias: parcelas con **Pie $0** y **cuotas desde $234.500** en los cinco proyectos de Compra Tu Parcela.

Sitio estático, sin build ni dependencias. Se publica tal cual en GitHub Pages.

---

## Archivos

| Archivo | Qué es |
|---|---|
| **`datos.js`** | **Fuente única de datos.** Precios, cuotas, fotos, planos, fechas y enlaces. Lo usan las dos páginas |
| `index.html` | Portada: hero, contador, proyectos, calculadora, newsletter y WhatsApp |
| `proyecto.html` | Ficha de proyecto. Se abre con `?id=` (por ejemplo `proyecto.html?id=longavi`) |
| `terminos.html` | Términos y Condiciones de la promoción |
| `assets/` | Escudo, logo, favicons y fotos, ya optimizados |
| `planos/` | Planos de loteo en PDF, para descargar desde cada ficha |
| `.nojekyll` | Le dice a GitHub Pages que sirva los archivos sin procesarlos con Jekyll |

Los cinco `id` son: `guillermo`, `cauquenes`, `litueche`, `longavi`, `danilo`.

---

## Qué hay que completar antes de publicar

### 1. Configuración

Todo vive en **`datos.js`**. Al cambiar algo ahí se actualizan la portada y las cinco fichas a la vez.

```js
window.PARCELAZO = {
  inicioVenta: '2026-09-16T19:30:00-03:00',  // live de apertura, miercoles 16
  cierreVenta: '2026-09-21T23:59:00-03:00',  // PENDIENTE: fecha real de cierre
  whatsappGrupo: 'https://chat.whatsapp.com/H2VMUCJoOCtFBfy2UIPvth',
  newsletterEndpoint: '',                    // PENDIENTE: URL del proveedor de email
  tasaAnual: 19.5,
  plazos: [12, 24, 36, 48],
  plazoDestacado: 48,                        // el que define el "cuotas desde"
  proyectos: [ /* ... */ ]
};
```

### Estado de los datos

| Dato | Estado |
|---|---|
| Precios «desde» de los 5 proyectos | Cargados |
| Cuotas por plazo (12/24/36/48) | Cargadas desde `Financiamiento_pie0.xlsx` |
| Tasa 19,5% anual | Cargada |
| Link del grupo de WhatsApp | Cargado |
| Planos de loteo | 3 de 5 |
| Fotos | 3 de 5 proyectos |
| Fecha de apertura (live) | Cargada: mié 16 de sept, 19:30 |
| Fecha de cierre | Pendiente |
| Endpoint del newsletter | Pendiente |
| Superficies (5.000 m²) | Supuesto, sin confirmar |
| Comunas de los 5 proyectos | Confirmadas por coordenadas |
| Coordenadas de los loteos | Cargadas |

### 2. Cómo funciona el financiamiento

El financiamiento **tiene interés**: tasa del **19,5% anual efectiva**, con cuota fija (sistema francés).
La tasa mensual equivalente es `(1 + 0,195)^(1/12) − 1`, no `0,195 / 12`.

```js
const tasaMensual = () => Math.pow(1 + D.tasaAnual / 100, 1 / 12) - 1;
const pmt = (capital, n) => { const i = tasaMensual(); return capital * i / (1 - Math.pow(1 + i, -n)); };
```

Cada proyecto trae sus cuotas **precargadas desde la planilla**, así que con pie $0 la web muestra
exactamente los valores del Excel. Si el visitante agrega pie, la cuota se recalcula con la misma fórmula
sobre el saldo.

| Proyecto | Precio desde | 12 cuotas | 24 | 36 | 48 |
|---|---|---|---|---|---|
| Don Guillermo | $7.990.000 | $732.164 | $398.654 | $288.649 | **$234.500** |
| Praderas de Cauquenes | $8.990.000 | $823.799 | $448.548 | $324.776 | $263.850 |
| Jardines de Litueche | $12.990.000 | $1.190.340 | $648.125 | $469.281 | $381.247 |
| Vive Longaví | $13.500.000 | $1.237.074 | $673.571 | $487.706 | $396.215 |
| Hacienda Don Danilo | $14.990.000 | $1.373.610 | $747.913 | $541.534 | $439.945 |

El «cuotas desde» del hero sale solo: es la cuota más baja de la tabla con `plazoDestacado`.
No hay ninguna cifra escrita a mano en el HTML.

### 3. Fotos y planos

Optimizadas en `assets/`, generadas desde `Material/` (que no se sube al repo por peso).

| Proyecto | Ubicación | Fotos | Plano | Mapa |
|---|---|---|---|---|
| Don Guillermo | Sector Quilico, Hualañé (Maule) | **Falta** | **Falta** | Sí |
| Praderas de Cauquenes | Cauquenes (Maule) | 5 | Sí (rasterizado) | Sí |
| Jardines de Litueche | Litueche (O'Higgins) | 5 | Sí | Sí |
| Vive Longaví | Longaví (Maule) | 5 | Sí | Sí |
| Hacienda Don Danilo | Sector El Cuzco, Litueche (O'Higgins) | **Falta** | **Falta** | Sí |

Para agregar fotos a un proyecto: deja los archivos en `assets/` como `don-guillermo.jpg` + `.webp`
(y `-2`, `-3`… para la galería), y agrega los nombres base al array `fotos` de ese proyecto en `datos.js`.

El plano de Praderas de Cauquenes venía en 55,7 MB; se rasterizó a 160 dpi y quedó en 8 MB,
manteniendo legible la numeración de los lotes. Los otros dos se copiaron tal cual.

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

> No lo actives hasta cerrar la fecha de término y la revisión legal de los Términos.

### Dominio propio

Para servirlo desde un subdominio de compratuparcela.cl:

1. Crea un archivo `CNAME` en la raíz del repo con una sola línea: `dieciocho.compratuparcela.cl`
2. En el DNS del dominio, agrega un registro `CNAME` de `dieciocho` apuntando a `lukas-code-master-ctp.github.io`
3. En **Settings → Pages**, escribe el dominio y activa **Enforce HTTPS**

Todas las rutas del sitio son relativas, así que funciona igual en `lukas-code-master-ctp.github.io/parcelazo/` que en un dominio propio.

---

## Notas técnicas

- CSS y JS embebidos en cada página; los datos van aparte en `datos.js`. La única dependencia externa es Google Fonts (Alfa Slab One, Rye, Barlow, Barlow Condensed).
- Las imágenes se sirven en WebP con respaldo JPG/PNG vía `<picture>`. `assets/` pesa ~6.2 MB y `planos/` ~15 MB.
- Las fotos de las tarjetas usan `loading="lazy"`; el escudo del hero usa `fetchpriority="high"`.
- La ficha de proyecto lee `?id=` de la URL. Si el id no existe, redirige a la portada.
- El mapa usa el embed de Google Maps sin API key. Cada proyecto tiene `coords: [lat, lng]` del loteo (zoom 15) y `mapsUrl` con el link corto oficial, que alimenta el botón «Cómo llegar».
- Respeta `prefers-reduced-motion`: con esa preferencia activada se desactivan todas las animaciones.
- Todas las fechas visibles («Miércoles 16 de septiembre · 19:30 h», el contador, el aviso de las fichas) se generan desde `inicioVenta` con `Intl.DateTimeFormat` y `timeZone: 'America/Santiago'`. No hay fechas escritas a mano: al cambiar `inicioVenta` se actualiza todo.
- En septiembre Chile ya está en horario de verano (parte el primer domingo del mes), por eso el `-03:00` del ISO.
- `terminos.html` tiene hoja de estilos de impresión: se puede exportar a PDF desde el navegador sin el nav ni el índice.
