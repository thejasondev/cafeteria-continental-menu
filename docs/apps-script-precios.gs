/**
 * Puente de precios — Cafetería Continental
 * -----------------------------------------
 * Se pega en la hoja de cálculo: Extensiones > Apps Script.
 * Solo hay que configurarlo una vez (ver docs/GESTION-PRECIOS.md).
 *
 * Columnas de la hoja (fila 1 = cabeceras):
 *   A: Categoria | B: Producto | C: Precio (en euros)
 */

/** Devuelve los precios en JSON al build de la web (protegido por token). */
function doGet(e) {
  var tokenEsperado = PropertiesService.getScriptProperties().getProperty('TOKEN')
  var tokenRecibido = e && e.parameter ? e.parameter.token : null
  if (!tokenEsperado || tokenRecibido !== tokenEsperado) {
    return respuestaJson({ error: 'no autorizado' })
  }

  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  var datos = hoja.getDataRange().getValues()
  var salida = []

  for (var i = 1; i < datos.length; i++) {
    var categoria = String(datos[i][0] || '').trim()
    var producto = String(datos[i][1] || '').trim()
    var precioCrudo = datos[i][2]
    if (!categoria || !producto || precioCrudo === '' || precioCrudo === null) continue

    var precio = Number(String(precioCrudo).replace(',', '.'))
    if (!isFinite(precio) || precio < 0) continue

    salida.push({ categoria: categoria, producto: producto, precio: precio })
  }

  return respuestaJson({ precios: salida })
}

/**
 * Activa un nuevo despliegue de Vercel cuando se edita un precio.
 * Debe configurarse como activador INSTALABLE "Al editar" (ver guía).
 */
function alEditar(e) {
  // Solo reacciona a cambios en la columna C (Precio).
  if (e && e.range && e.range.getColumn() !== 3) return

  var deployHook = PropertiesService.getScriptProperties().getProperty('DEPLOY_HOOK')
  if (!deployHook) return

  try {
    UrlFetchApp.fetch(deployHook, { method: 'post', muteHttpExceptions: true })
  } catch (err) {
    console.error('No se pudo lanzar el despliegue: ' + err)
  }
}

function respuestaJson(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON)
}
