/* ============================================================
   PARCELAZO DIECIO$0 - Datos de la campana
   Fuente unica de verdad: la usan index.html y proyecto.html.
   Al cambiar algo aca se actualizan las dos paginas.
   ============================================================ */
window.PARCELAZO = {

  /* El Parcelazo corre durante todo septiembre. De estas dos fechas
     salen el sello del hero, el aviso de las fichas y los Terminos.
     OJO CON EL OFFSET: el horario de verano de Chile parte el primer
     domingo de septiembre (el 6 en 2026), asi que el dia 1 todavia va
     en -04:00 y el 16 y el 30 ya van en -03:00. Con -03:00 el dia 1,
     la fecha se corre al 31 de agosto. */
  inicioVenta: '2026-09-01T00:00:00-04:00',
  cierreVenta: '2026-09-30T23:59:00-03:00',

  /* Transmision de apertura por Instagram. Se muestra como dato
     aparte, no como inicio de la venta. Poner live en null para no
     mencionarla. El 4 de septiembre aun va en -04:00. */
  live: '2026-09-04T12:00:00-04:00',
  liveCanal: '@compratuparcela',
  liveUrl: 'https://www.instagram.com/compratuparcela/',

  /* Contacto directo por WhatsApp. El numero va en formato
     internacional sin + ni espacios, como lo pide wa.me. */
  whatsapp: '56950997410',
  whatsappVisible: '+56 9 5099 7410',

  /* >>> PENDIENTE: endpoint del proveedor de email marketing <<< */
  newsletterEndpoint: '',

  /* Financiamiento directo, segun planilla Financiamiento_pie0.xlsx.
     La tasa es EFECTIVA ANUAL. La cuota sale de PMT usando la tasa
     mensual equivalente: (1 + tasaAnual/100)^(1/12) - 1.
     Las cuotas con pie $0 vienen precargadas por proyecto; si el
     visitante agrega pie, se recalculan con la misma formula. */
  /* Al reservar se pagan los gastos notariales. Es el unico desembolso
     inicial y se imputa al valor de la parcela, asi que no es un pie.
     El monto es aproximado porque depende de la notaria. */
  reserva: 300000,

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
    /* Cuota mensual segun Financiamiento_pie0.xlsx (valores comerciales
       ya redondeados en la planilla, no el PMT exacto) */
    /* Variantes de parcela dentro del loteo, de la mas barata a la mas
       cara: la primera alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$7.990.000', precio: 7990000, cuotas: { 12: 730000, 24: 400000, 36: 290000, 48: 235000 } }
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
    /* Cuota mensual segun Financiamiento_pie0.xlsx (valores comerciales
       ya redondeados en la planilla, no el PMT exacto) */
    /* Variantes de parcela dentro del loteo, de la mas barata a la mas
       cara: la primera alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$8.990.000', precio: 8990000, cuotas: { 12: 820000, 24: 445000, 36: 325000, 48: 265000 } }
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
    /* Cuota mensual segun Financiamiento_pie0.xlsx (valores comerciales
       ya redondeados en la planilla, no el PMT exacto) */
    /* Variantes de parcela dentro del loteo, de la mas barata a la mas
       cara: la primera alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: '$12.990.000', precio: 12990000, cuotas: { 12: 1190000, 24: 650000, 36: 470000, 48: 380000 } }
    ],
    fotos: ["jardines-litueche", "jardines-litueche-2", "jardines-litueche-3", "jardines-litueche-4", "jardines-litueche-5"],
    plano: 'planos/jardines-litueche-plano.pdf',

    coords: [-34.107009, -71.712509],
    mapsUrl: 'https://maps.app.goo.gl/e6QhQDPfXmZt2rFw6',
    sector: null,
    destacado: "Más cerca de la costa"
  },
  {
    id: 'longavi',
    nombre: "Vive Longaví",
    comuna: "Longaví",
    region: "Región del Maule",
    m2: 5000,                    /* supuesto, sin confirmar */
    /* Cuota mensual segun Financiamiento_pie0.xlsx (valores comerciales
       ya redondeados en la planilla, no el PMT exacto) */
    /* Variantes de parcela dentro del loteo, de la mas barata a la mas
       cara: la primera alimenta el "desde" de la tarjeta. */
    variantes: [
      { etiqueta: 'Más al interior',  precio: 13500000, cuotas: { 12: 1230000, 24: 675000, 36: 490000, 48: 400000 } },
      { etiqueta: 'Cerca del acceso', precio: 16500000, cuotas: { 12: 1510000, 24: 825000, 36: 595000, 48: 485000 } }
    ],
    fotos: ["vive-longavi", "vive-longavi-2", "vive-longavi-3", "vive-longavi-4", "vive-longavi-5"],
    plano: 'planos/vive-longavi-plano.pdf',

    coords: [-36.125343, -71.534417],
    mapsUrl: 'https://maps.app.goo.gl/Gd1qQSAArA5Kb5CXA',
    sector: null,
    destacado: null
  },
  {
    id: 'danilo',
    nombre: "Hacienda Don Danilo",
    comuna: "Litueche",
    region: "Región de O’Higgins",
    m2: 5000,                    /* supuesto, sin confirmar */
    /* Cuota mensual segun Financiamiento_pie0.xlsx (valores comerciales
       ya redondeados en la planilla, no el PMT exacto) */
    /* Variantes de parcela dentro del loteo, de la mas barata a la mas
       cara: la primera alimenta el "desde" de la tarjeta. */
    variantes: [
      /* >>> PENDIENTE: nombrar que distingue a cada una <<< */
      { etiqueta: '$14.990.000', precio: 14990000, cuotas: { 12: 1370000, 24: 750000, 36: 540000, 48: 440000 } },
      { etiqueta: '$15.990.000', precio: 15990000, cuotas: { 12: 1460000, 24: 800000, 36: 580000, 48: 470000 } },
      { etiqueta: '$18.990.000', precio: 18990000, cuotas: { 12: 1735000, 24: 950000, 36: 690000, 48: 560000 } }
    ],
    fotos: [],
    plano: null,


    coords: [-34.134905, -71.600353],
    mapsUrl: 'https://maps.app.goo.gl/LLbrzpsJ9EWataZu5',
    sector: 'Sector El Cuzco',
    destacado: null
  }
  ]
};
