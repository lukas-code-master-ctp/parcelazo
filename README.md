# Parcelazo Diecio$0 — Compra Tu Parcela

Landing de campaña para la venta online de Fiestas Patrias: parcelas con **Pie $0** y **cuotas desde $235.000** en los cinco proyectos de Compra Tu Parcela.

Sitio estático, sin build ni dependencias. En producción: **https://parcelazo.cl**

---

## Archivos

| Archivo | Qué es |
|---|---|
| **`datos.js`** | **Fuente única de datos.** Precios, cuotas, fotos, planos, fechas y enlaces. Lo usan las dos páginas |
| `index.html` | Portada: hero, proyectos, calculadora, newsletter y WhatsApp |
| `proyecto.html` | Ficha de proyecto. Se abre con `?id=` (por ejemplo `proyecto.html?id=longavi`) |
| `terminos.html` | Términos y Condiciones de la promoción |
| `assets/` | Escudo, logo, favicons y fotos, ya optimizados |
| `planos/` | Planos de loteo en PDF, para descargar desde cada ficha |
| `robots.txt` | Permite el rastreo, bloquea `/planos/` y declara el sitemap |
| `sitemap.xml` | Las 7 URLs del sitio. **Generado** por `seo.py` |
| `llms.txt` | Resumen en texto plano para motores generativos. **Generado** por `seo.py` |
| `seo.py` | Regenera `sitemap.xml` y `llms.txt` desde `datos.js` |
| `.nojekyll` | Resto de un despliegue en GitHub Pages. Vercel lo ignora; se deja por si algún día se vuelve a Pages |

Los cinco `id` son: `guillermo`, `cauquenes`, `litueche`, `longavi`, `danilo`.

---

## Qué hay que completar antes de publicar

### 1. Configuración

Todo vive en **`datos.js`**. Al cambiar algo ahí se actualizan la portada y las cinco fichas a la vez.

```js
window.PARCELAZO = {
  inicioVenta: '2026-09-01T00:00:00-04:00',  // ojo: el dia 1 aun va en -04:00
  cierreVenta: '2026-09-30T23:59:00-03:00',
  live:        '2026-09-04T12:00:00-04:00',  // ojo: el dia 4 tambien va en -04:00
  liveCanal:   '@compratuparcela',           // null para no nombrar el canal
  liveUrl:     'https://www.instagram.com/compratuparcela/',
  whatsapp:        '56950997410',        // formato wa.me: sin + ni espacios
  whatsappVisible: '+56 9 5099 7410',    // como se muestra en pantalla
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
| Cuotas por plazo (12/24/36/48) | Cargadas desde `Financiamiento_pie0.xlsx` (1 sept) |
| Variantes de precio | Ninguna activa; la estructura queda lista |
| Tasa (interna, no se muestra) | Cargada |
| Número de WhatsApp | Cargado |
| Planos de loteo | 3 de 5 |
| Fotos | 3 de 5 proyectos |
| Periodo del evento | Cargado: 1 al 30 de septiembre |
| Live de apertura | Cargado: vie 4 de sept, 12:00, por Instagram |
| Endpoint del newsletter | Pendiente |
| Datos de la empresa en los Términos | Cargados |
| Costo de la reserva | Cargado: ~$300.000 |
| Superficies (5.000 m²) | Supuesto, sin confirmar |
| Comunas de los 5 proyectos | Confirmadas por coordenadas |
| Coordenadas de los loteos | Cargadas |

### 2. Cómo funciona el financiamiento

El financiamiento **tiene interés**: `tasaAnual` en `datos.js` es una tasa **efectiva anual**, con cuota
fija (sistema francés). La tasa mensual equivalente es `(1 + tasa)^(1/12) − 1`, no `tasa / 12`.

> **La tasa no se muestra en ninguna parte del sitio**, por decisión comercial: ni en las calculadoras
> ni en los Términos ni en `llms.txt`. Sigue en `datos.js` porque es lo que recalcula la cuota cuando
> el visitante agrega pie. Lo que sí se publica son las cuotas y el total a pagar por plazo.

```js
const tasaMensual = () => Math.pow(1 + D.tasaAnual / 100, 1 / 12) - 1;
const pmt = (capital, n) => { const i = tasaMensual(); return capital * i / (1 - Math.pow(1 + i, -n)); };
```

Cada proyecto trae sus cuotas **precargadas desde la planilla**, así que con pie $0 la web muestra
exactamente los valores del Excel. Si el visitante agrega pie, la cuota se recalcula con la misma fórmula
sobre el saldo.

| Proyecto | Precio | 12 cuotas | 24 | 36 | 48 |
|---|---|---|---|---|---|
| Don Guillermo | $7.990.000 | $730.000 | $400.000 | $290.000 | **$235.000** |
| Praderas de Cauquenes | $8.990.000 | $820.000 | $445.000 | $325.000 | $265.000 |
| Jardines de Litueche | $12.990.000 | $1.190.000 | $650.000 | $470.000 | $380.000 |
| Vive Longaví | $13.500.000 | $1.230.000 | $675.000 | $490.000 | $400.000 |
| Hacienda Don Danilo | $14.990.000 | $1.370.000 | $750.000 | $540.000 | $440.000 |

> **Las cuotas de la planilla vienen redondeadas a miles**, no son el PMT exacto. Cuando el visitante
> agrega pie, la web recalcula con PMT y redondea igual, hacia arriba, para no mezclar cifras redondas
> con cifras al peso ni prometer una cuota menor a la real.

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

**Hoy los cinco proyectos tienen una sola variante**, así que los botones no se ven en ninguna parte.
La estructura queda lista por si vuelve a haber parcelas de distinto valor: basta agregar un segundo
objeto al array. La etiqueta describe la parcela y el precio va debajo, como segunda línea del botón.

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

`terminos.html` sigue siendo un **borrador que debe revisar el abogado antes de publicarse**, pero
ya no le faltan datos: los marcadores rayados llegaron a cero.

Están cargados la razón social, el RUT, el domicilio, el correo, las superficies, el proceso de
reserva y su costo. Las cuatro condiciones del crédito —reajuste, prepago, mora y escrituración—
quedaron como **remisión al contrato** («Según lo que establezca el contrato de promesa de
compraventa»), porque se definen con los abogados. Es válido, pero conviene reemplazarlas por las
condiciones concretas cuando existan: un cliente que quiere saber qué pasa si se atrasa hoy no lo
encuentra en la web.

### La reserva y el «Pie $0»

Al reservar se pagan los **gastos notariales**, unos **$300.000**, que se imputan al valor de la
parcela. Es el único desembolso inicial. Como la campaña se llama «Pie $0», eso se declara en tres
lugares: el bloque de beneficios, la nota de las dos calculadoras y las cláusulas 5, 9, 10 y 11.

El monto vive en `datos.js` (`reserva: 300000`) y las notas se arman desde ahí. Con `reserva: 0`
o `null` desaparecen solas.

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

Todavía quedan datos por cerrar (ver el estado más arriba): el endpoint del newsletter,
el material de dos proyectos y la revisión legal de los Términos.

---

## SEO y GEO

### Qué hay

- **`robots.txt`** — permite todo salvo `/planos/` (PDFs pesados que no aportan al índice) y declara el sitemap. Los rastreadores de IA (GPTBot, PerplexityBot, ClaudeBot, Google-Extended y otros) están **permitidos a propósito**: la idea es que puedan citar precios y ubicaciones correctas en vez de inventarlos.
- **`sitemap.xml`** — portada, las cinco fichas y los Términos.
- **`llms.txt`** — resumen en texto plano con precios, cuotas, coordenadas y advertencias de cómo citar los datos. Es el formato que están adoptando los motores generativos.
- **Datos estructurados (schema.org)** en JSON-LD, generados desde `datos.js` para que nunca contradigan lo que se ve en pantalla:
  - Portada: `RealEstateAgent`, `WebSite`, `SaleEvent` (con el periodo del evento) e `ItemList` con los cinco proyectos.
  - Fichas: `Product` con `AggregateOffer` cuando hay variantes, `Place` con coordenadas, y `BreadcrumbList`.
- **Metas geográficas** por ficha: `geo.position`, `ICBM` y `geo.placename` con las coordenadas del loteo.
- **Canonical** en las tres páginas y `max-image-preview:large` para que Google muestre la foto grande.

### Al cambiar proyectos, precios o fechas

```bash
python seo.py
```

Regenera `sitemap.xml` y `llms.txt`. El JSON-LD no hace falta tocarlo: sale de `datos.js` en tiempo de carga.

### Limitación conocida

Las fichas de proyecto se arman con JavaScript a partir de `?id=`. **Google ejecuta JS y las indexa bien**, pero los rastreadores que no lo hacen (algunos de IA, y previsualizadores como el de WhatsApp) ven la plantilla vacía. Por eso la vista previa al compartir una ficha muestra la imagen genérica de la campaña.

Si el SEO orgánico de cada proyecto pasa a importar, la solución es generar cinco HTML estáticos desde una plantilla. Se puede hacer con un script parecido a `seo.py`, a costa de tener que regenerarlos cada vez que cambien los datos.

---

## Notas técnicas

- CSS y JS embebidos en cada página; los datos van aparte en `datos.js`. La única dependencia externa es Google Fonts (Alfa Slab One, Rye, Barlow, Barlow Condensed).
- Las imágenes se sirven en WebP con respaldo JPG/PNG vía `<picture>`. `assets/` pesa ~6.2 MB y `planos/` ~15 MB.
- Las fotos de las tarjetas usan `loading="lazy"`; el escudo del hero usa `fetchpriority="high"`.
- La ficha de proyecto lee `?id=` de la URL. Si el id no existe, redirige a la portada.
- El mapa usa el embed de Google Maps sin API key (`maps?q=lat,lng&z=15&output=embed`). Cada proyecto tiene `coords: [lat, lng]` del loteo y `mapsUrl` con el link corto oficial, que alimenta el botón «Cómo llegar». Google redirige ese `src` a `/maps/embed?...`, que responde sin `X-Frame-Options` y por eso sí se puede embeber.
- **Los botones de WhatsApp abren una conversación directa** con un mensaje ya redactado, vía `wa.me`. El texto cambia según el contexto: genérico en el nav y el hero; con el nombre del proyecto en las fichas; y con proyecto, variante, plazo y cuota en las dos calculadoras, para que el ejecutivo sepa de qué se está hablando sin preguntar.
- Respeta `prefers-reduced-motion`: con esa preferencia activada se desactivan todas las animaciones.
- **No hay cuenta regresiva.** El Parcelazo dura todo septiembre, así que el hero muestra un sello con el rango y el aviso de las fichas hace lo mismo. Ambos tienen tres estados: antes, durante y después.
- Todas las fechas visibles se generan desde `inicioVenta` / `cierreVenta` / `live` con `Intl.DateTimeFormat` y `timeZone: 'America/Santiago'`. No hay fechas escritas a mano.
- **Cuidado con el offset horario.** El horario de verano de Chile parte el primer domingo de septiembre (el 6 en 2026): los días 1 y 4 van en `-04:00`, y el 30 en `-03:00`. Con `-03:00` el día 1, la fecha se corre al 31 de agosto — pasó al cargar estos datos.
- Las etiquetas Open Graph usan **URLs absolutas** (`https://www.parcelazo.cl/...`). WhatsApp y Facebook no resuelven rutas relativas al generar la vista previa del enlace, y WhatsApp es el canal principal de la campaña.
- Los crawlers no ejecutan JS, así que las fichas de proyecto comparten la imagen genérica de la campaña, no la foto del proyecto. Su `og:url` y `canonical` sí se completan con el `id` real al cargar, para los navegadores.
- `terminos.html` tiene hoja de estilos de impresión: se puede exportar a PDF desde el navegador sin el nav ni el índice.
