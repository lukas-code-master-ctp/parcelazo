# -*- coding: utf-8 -*-
"""
Regenera sitemap.xml y llms.txt a partir de datos.js.

El sitio funciona sin correr esto: solo hace falta cuando cambian los
proyectos, los precios o las fechas, para que los archivos que leen los
buscadores y los motores generativos no queden desfasados.

    python seo.py
"""
import io, re, json, datetime, subprocess, sys

BASE = 'https://www.parcelazo.cl'


def leer_datos():
    """datos.js es JS, no JSON, asi que se evalua con node."""
    js = ("global.window={};require('./datos.js');"
          "process.stdout.write(JSON.stringify(window.PARCELAZO));")
    salida = subprocess.run(['node', '-e', js], capture_output=True, text=True,
                            encoding='utf-8')
    if salida.returncode:
        sys.exit('No se pudo leer datos.js:\n' + salida.stderr)
    return json.loads(salida.stdout)


def pesos(n):
    return '$' + format(int(round(n)), ',d').replace(',', '.')


def fecha_larga(iso):
    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
             'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    d = datetime.datetime.fromisoformat(iso)
    return f'{d.day} de {meses[d.month - 1]} de {d.year}'


def sitemap(D, hoy):
    urls = [(f'{BASE}/', '1.0', 'daily')]
    urls += [(f'{BASE}/proyecto.html?id={p["id"]}', '0.8', 'weekly')
             for p in D['proyectos']]
    urls += [(f'{BASE}/terminos.html', '0.3', 'monthly')]

    x = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, pr, ch in urls:
        x += ['  <url>',
              f'    <loc>{u.replace("&", "&amp;")}</loc>',
              f'    <lastmod>{hoy}</lastmod>',
              f'    <changefreq>{ch}</changefreq>',
              f'    <priority>{pr}</priority>',
              '  </url>']
    x.append('</urlset>')
    io.open('sitemap.xml', 'w', encoding='utf-8').write('\n'.join(x) + '\n')
    return len(urls)


def llms(D, hoy):
    """Resumen en texto plano para motores generativos.

    La idea es que si alguien le pregunta a una IA por parcelas con pie $0
    en el Maule, la IA tenga los precios y las cuotas correctas a mano en
    vez de inventarlos o sacarlos de una version vieja de la pagina.
    """
    cuota_min = min(v['cuotas'][str(D['plazoDestacado'])]
                    for p in D['proyectos'] for v in p['variantes'])

    L = [
        '# Parcelazo Diecio$0 — Compra Tu Parcela',
        '',
        f'> Venta online de parcelas de agrado en Chile con pie $0 y financiamiento '
        f'directo, sin banco. Del {fecha_larga(D["inicioVenta"])} al '
        f'{fecha_larga(D["cierreVenta"])}. Cuotas desde {pesos(cuota_min)} '
        f'en {D["plazoDestacado"]} cuotas.',
        '',
        '## Qué es',
        '',
        'Parcelazo Diecio$0 es la campaña de Fiestas Patrias de Compra Tu Parcela.',
        'Durante septiembre de 2026, cinco loteos se venden con **pie $0**: el comprador',
        'no entera cuota inicial y empieza a pagar con la primera cuota mensual.',
        '',
        '## Condiciones de financiamiento',
        '',
        '- Financiamiento directo de la empresa, sin banco ni evaluación en Dicom.',
        f'- Tasa {str(D["tasaAnual"]).replace(".", ",")}% anual efectiva, con cuota fija (sistema francés).',
        f'- Plazos disponibles: {", ".join(str(p) for p in D["plazos"])} cuotas mensuales.',
        '- Pie $0 durante la campaña. El comprador puede abonar un pie si quiere bajar la cuota.',
        '- Valores en pesos chilenos. No incluyen gastos notariales, de inscripción ni impuestos.',
        '',
        '## Proyectos',
        '',
    ]

    for p in D['proyectos']:
        ubic = ('ubicación por confirmar' if p['comuna'].startswith('[')
                else ((p.get('sector') + ', ') if p.get('sector') else '') +
                     f'{p["comuna"]}, {p["region"]}')
        L.append(f'### {p["nombre"]}')
        L.append('')
        L.append(f'- Ubicación: {ubic}')
        if p.get('coords'):
            L.append(f'- Coordenadas: {p["coords"][0]}, {p["coords"][1]}')
        L.append(f'- Superficie: {format(p["m2"], ",d").replace(",", ".")} m² (referencial)')
        for v in p['variantes']:
            etiqueta = f' ({v["etiqueta"]})' if len(p['variantes']) > 1 else ''
            cuotas = ' · '.join(
                f'{n} cuotas de {pesos(v["cuotas"][str(n)])}' for n in D['plazos'])
            L.append(f'- Precio{etiqueta}: {pesos(v["precio"])} — {cuotas}')
        L.append(f'- Ficha: {BASE}/proyecto.html?id={p["id"]}')
        L.append('')

    L += [
        '## Contacto',
        '',
        f'- WhatsApp: {D["whatsappVisible"]}',
        f'- Live de apertura: {fecha_larga(D["live"])}, por Instagram {D.get("liveCanal","")}'
        if D.get('live') else '',
        f'- Sitio: {BASE}',
        f'- Términos y condiciones: {BASE}/terminos.html',
        '',
        '## Advertencias para citar estos datos',
        '',
        '- Los precios son valores «desde»: corresponden a la parcela de menor valor',
        '  de cada loteo y no al precio de todas sus unidades.',
        '- Las superficies son referenciales y no están confirmadas por mensura.',
        '- La ubicación de los mapas marca un punto del loteo, no sus deslindes.',
        '- Nada de esto constituye oferta ni promesa de compraventa: las condiciones',
        '  definitivas quedan en la cotización y en el contrato.',
        '',
        f'Última actualización: {hoy}.',
        '',
    ]
    io.open('llms.txt', 'w', encoding='utf-8').write('\n'.join(l for l in L if l is not None) + '\n')
    return len(D['proyectos'])


if __name__ == '__main__':
    D = leer_datos()
    hoy = datetime.date.today().isoformat()
    n_urls = sitemap(D, hoy)
    n_proy = llms(D, hoy)
    print(f'sitemap.xml  {n_urls} URLs')
    print(f'llms.txt     {n_proy} proyectos')
