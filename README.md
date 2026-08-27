# Parcelazo Diecio$0 — Compra Tu Parcela

Landing de campaña para la venta online de Fiestas Patrias: parcelas con **Pie $0** y **cuotas desde $234.500** en los cinco proyectos de Compra Tu Parcela.

Sitio estático, sin build ni dependencias. En producción: **https://parcelazo.cl**

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
| `.nojekyll` | Resto de un despliegue en GitHub Pages. Vercel lo ignora; se deja por si algún día se vuelve a Pages |

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
| Cuotas por plazo (12/24/36/48) | Cargadas desde `Financiamiento_pie0 (1).xlsx` |
| Variantes de precio | Vive Longaví con dos valores |
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

| Proyecto | Precio | 12 cuotas | 24 | 36 | 48 |
|---|---|---|---|---|---|
| Don Guillermo | $7.990.000 | $732.164 | $398.654 | $288.649 | **$234.500** |
| Praderas de Cauquenes | $8.990.000 | $823.799 | $448.548 | $324.776 | $263.850 |
| Jardines de Litueche | $12.990.000 | $1.190.340 | $648.125 | $469.281 | $381.247 |
| Hacienda Don Danilo | $14.990.000 | $1.373.610 | $747.913 | $541.534 | $439.945 |
| Vive Longaví · más al interior | $13.500.000 | $1.237.074 | $673.571 | $487.706 | $396.215 |
| Vive Longaví · cerca del acceso | $16.500.000 | $1.511.979 | $823.253 | $596.085 | $484.263 |

### Variantes de precio

Un proyecto puede ofrecer parcelas de distinto valor. Por eso cada uno lleva un array `variantes`:

```js
variantes: [
  { etiqueta: 'Más al interior',  precio: 13500000, cuotas: { 12: …, 24: …, 36: …, 48: … } },
  { etiqueta: 'Cerca del acceso', precio: 16500000, cuotas: { … } }
]
```

**La primera del array debe ser siempre la más barata**: es la que alimenta el «desde» de la tarjeta.
Si hay más de una, la calculadora y la ficha muestran botones para elegir; con una sola no aparecen.
Hoy solo Vive Longaví tiene dos.

La etiqueta describe la parcela y el precio va debajo, como segunda línea del botón.
En Vive Longaví la diferencia es la ubicación dentro del loteo: las más cercanas al acceso valen más.

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

## Despliegue

En producción: **https://parcelazo.cl** (el apex redirige con 308 a `www.parcelazo.cl`,
que es el dominio canónico y el que usan las etiquetas Open Graph).

El sitio está en **Vercel**, conectado al repositorio. Cada push a `main` dispara un despliegue solo:

```bash
git add -A && git commit -m "Actualiza la landing" && git push
```

No hay build: Vercel sirve los archivos tal cual. Si pide configuración, es un proyecto
estático sin framework, sin comando de build y con la raíz del repo como directorio de salida.

Repositorio: https://github.com/lukas-code-master-ctp/parcelazo

> **Si algún día cambia el dominio**, hay que actualizar las etiquetas `og:image`, `og:url`
> y `canonical` de las tres páginas, más la constante `BASE` implícita en `proyecto.html`.
> Open Graph exige URLs absolutas, así que el dominio va escrito en el HTML.

### Dominio propio

Para servirlo desde un subdominio de compratuparcela.cl (por ejemplo `dieciocho.compratuparcela.cl`),
se agrega en **Vercel → Settings → Domains** y ahí mismo indica qué registro DNS crear.
No hace falta el archivo `CNAME` en el repo: eso era para GitHub Pages.

Todas las rutas del sitio son relativas, así que funciona igual en el dominio de Vercel
que en uno propio, y en un subdirectorio si hiciera falta.

### Antes de difundir el link

Todavía quedan datos por cerrar (ver el estado más arriba): la fecha de término,
el material de dos proyectos y la revisión legal de los Términos.

---

## Notas técnicas

- CSS y JS embebidos en cada página; los datos van aparte en `datos.js`. La única dependencia externa es Google Fonts (Alfa Slab One, Rye, Barlow, Barlow Condensed).
- Las imágenes se sirven en WebP con respaldo JPG/PNG vía `<picture>`. `assets/` pesa ~6.2 MB y `planos/` ~15 MB.
- Las fotos de las tarjetas usan `loading="lazy"`; el escudo del hero usa `fetchpriority="high"`.
- La ficha de proyecto lee `?id=` de la URL. Si el id no existe, redirige a la portada.
- El mapa usa el embed de Google Maps sin API key (`maps?q=lat,lng&z=15&output=embed`). Cada proyecto tiene `coords: [lat, lng]` del loteo y `mapsUrl` con el link corto oficial, que alimenta el botón «Cómo llegar». Google redirige ese `src` a `/maps/embed?...`, que responde sin `X-Frame-Options` y por eso sí se puede embeber.
- Respeta `prefers-reduced-motion`: con esa preferencia activada se desactivan todas las animaciones.
- Todas las fechas visibles («Miércoles 16 de septiembre · 19:30 h», el contador, el aviso de las fichas) se generan desde `inicioVenta` con `Intl.DateTimeFormat` y `timeZone: 'America/Santiago'`. No hay fechas escritas a mano: al cambiar `inicioVenta` se actualiza todo.
- En septiembre Chile ya está en horario de verano (parte el primer domingo del mes), por eso el `-03:00` del ISO.
- Las etiquetas Open Graph usan **URLs absolutas** (`https://www.parcelazo.cl/...`). WhatsApp y Facebook no resuelven rutas relativas al generar la vista previa del enlace, y WhatsApp es el canal principal de la campaña.
- Los crawlers no ejecutan JS, así que las fichas de proyecto comparten la imagen genérica de la campaña, no la foto del proyecto. Su `og:url` y `canonical` sí se completan con el `id` real al cargar, para los navegadores.
- `terminos.html` tiene hoja de estilos de impresión: se puede exportar a PDF desde el navegador sin el nav ni el índice.
