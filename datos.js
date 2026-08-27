/* ============================================================
   PARCELAZO DIECIO$0 - Datos de la campana
   Fuente unica de verdad: la usan index.html y proyecto.html.
   Al cambiar algo aca se actualizan las dos paginas.
   ============================================================ */
window.PARCELAZO = {

  /* Apertura del Parcelazo: el live del miercoles 16 de septiembre a
     las 19:30. En esa fecha Chile continental ya esta en UTC-3, porque
     el horario de verano parte el primer domingo de septiembre.
     De aqui salen el contador y todas las fechas que se muestran. */
  inicioVenta: '2026-09-16T19:30:00-03:00',

  /* >>> PENDIENTE: fecha real de cierre de la venta <<< */
  cierreVenta: '2026-09-21T23:59:00-03:00',

  whatsappGrupo: 'https://chat.whatsapp.com/H2VMUCJoOCtFBfy2UIPvth',

  /* >>> PENDIENTE: endpoint del proveedor de email marketing <<< */
  newsletterEndpoint: '',

  /* Financiamiento directo, segun planilla Financiamiento_pie0.xlsx.
     La tasa es EFECTIVA ANUAL. La cuota sale de PMT usando la tasa
     mensual equivalente: (1 + tasaAnual/100)^(1/12) - 1.
     Las cuotas con pie $0 vienen precargadas por proyecto; si el
     visitante agrega pie, se recalculan con la misma formula. */
  tasaAnual: 19.5,
  plazos: [12, 24, 36, 48],
  plazoDestacado: 48,            /* el que define el "cuotas desde" del hero */

  proyectos: [
  {
    id: 'guillermo',
    nombre: "Don Guillermo",
    comuna: "Hualañé",
    region: "Región del Maule",
    m2: 5000,                    /* supuesto, sin confirmar */
    /* Cuota mensual exacta segun la planilla Financiamiento_pie0.xlsx */
    /* Variantes de precio del loteo. La primera es la mas barata
       y es la que alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$7.990.000', precio: 7990000, cuotas: { 12: 732164, 24: 398654, 36: 288649, 48: 234500 } }
    ],
    fotos: [],
    plano: null,


    coords: [-34.877248, -71.913388],
    mapsUrl: 'https://maps.app.goo.gl/qzd4b2zCNSpcVb5o9',
    sector: 'Sector Quilico',
    destacado: "El más conveniente"
  },
  {
    id: 'cauquenes',
    nombre: "Praderas de Cauquenes",
    comuna: "Cauquenes",
    region: "Región del Maule",
    m2: 5000,                    /* supuesto, sin confirmar */
    /* Cuota mensual exacta segun la planilla Financiamiento_pie0.xlsx */
    /* Variantes de precio del loteo. La primera es la mas barata
       y es la que alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$8.990.000', precio: 8990000, cuotas: { 12: 823799, 24: 448548, 36: 324776, 48: 263850 } }
    ],
    fotos: ["praderas-cauquenes", "praderas-cauquenes-2", "praderas-cauquenes-3", "praderas-cauquenes-4", "praderas-cauquenes-5"],
    plano: 'planos/praderas-cauquenes-plano.pdf',

    coords: [-35.866250, -72.273528],
    mapsUrl: 'https://maps.app.goo.gl/1JJ4hxLmhtUrEiRw9',
    sector: null,
    destacado: null
  },
  {
    id: 'litueche',
    nombre: "Jardines de Litueche",
    comuna: "Litueche",
    region: "Región de O’Higgins",
    m2: 5000,                    /* supuesto, sin confirmar */
    /* Cuota mensual exacta segun la planilla Financiamiento_pie0.xlsx */
    /* Variantes de precio del loteo. La primera es la mas barata
       y es la que alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$12.990.000', precio: 12990000, cuotas: { 12: 1190340, 24: 648125, 36: 469281, 48: 381247 } }
    ],
    fotos: ["jardines-litueche", "jardines-litueche-2", "jardines-litueche-3", "jardines-litueche-4", "jardines-litueche-5"],
    plano: 'planos/jardines-litueche-plano.pdf',

    coords: [-34.107009, -71.712509],
    mapsUrl: 'https://maps.app.goo.gl/e6QhQDPfXmZt2rFw6',
    sector: null,
    destacado: "Más cerca de la costa"
  },
  {
    id: 'danilo',
    nombre: "Hacienda Don Danilo",
    comuna: "Litueche",
    region: "Región de O’Higgins",
    m2: 5000,                    /* supuesto, sin confirmar */
    /* Cuota mensual exacta segun la planilla Financiamiento_pie0.xlsx */
    /* Variantes de precio del loteo. La primera es la mas barata
       y es la que alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$14.990.000', precio: 14990000, cuotas: { 12: 1373610, 24: 747913, 36: 541534, 48: 439945 } }
    ],
    fotos: [],
    plano: null,


    coords: [-34.134905, -71.600353],
    mapsUrl: 'https://maps.app.goo.gl/LLbrzpsJ9EWataZu5',
    sector: 'Sector El Cuzco',
    destacado: null
  },
  {
    id: 'longavi',
    nombre: "Vive Longaví",
    comuna: "Longaví",
    region: "Región del Maule",
    m2: 5000,                    /* supuesto, sin confirmar */
    /* Cuota mensual exacta segun la planilla Financiamiento_pie0.xlsx */
    /* Variantes de precio del loteo. La primera es la mas barata
       y es la que alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$13.500.000', precio: 13500000, cuotas: { 12: 1237074, 24: 673571, 36: 487706, 48: 396215 } },
      { etiqueta: '$16.500.000', precio: 16500000, cuotas: { 12: 1511979, 24: 823253, 36: 596085, 48: 484263 } }
    ],
    fotos: ["vive-longavi", "vive-longavi-2", "vive-longavi-3", "vive-longavi-4", "vive-longavi-5"],
    plano: 'planos/vive-longavi-plano.pdf',

    coords: [-36.125343, -71.534417],
    mapsUrl: 'https://maps.app.goo.gl/Gd1qQSAArA5Kb5CXA',
    sector: null,
    destacado: null
  }
  ]
};
